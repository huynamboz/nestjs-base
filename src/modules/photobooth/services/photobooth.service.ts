import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photobooth } from '../entities/photobooth.entity';
import { Session } from '../entities/session.entity';
import {
  CreatePhotoboothDto,
  UpdatePhotoboothDto,
  PhotoboothResponseDto,
} from '../dto/photobooth.dto';
import { PhotoboothStatus } from '../enums/session-status.enum';
import {
  PaginationDto,
  PaginatedResponseDto,
} from '../../../common/dto/pagination.dto';
import { PaginationService } from '../../../common/services/pagination.service';

@Injectable()
export class PhotoboothService {
  constructor(
    @InjectRepository(Photobooth)
    private readonly photoboothRepository: Repository<Photobooth>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(): Promise<Photobooth[]> {
    return this.photoboothRepository.find({
      relations: ['sessions'],
      order: { createdAt: 'ASC' },
    });
  }

  async findAllPaginated(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Photobooth>> {
    const searchFields = ['name', 'description', 'location'];
    return this.paginationService.getPaginatedResults(
      this.photoboothRepository,
      paginationDto,
      searchFields,
    );
  }

  async findOne(id: string): Promise<Photobooth> {
    const photobooth = await this.photoboothRepository.findOne({
      where: { id },
      relations: ['sessions'],
    });

    if (!photobooth) {
      throw new NotFoundException(`Photobooth with ID ${id} not found`);
    }

    return photobooth;
  }

  async findAvailable(): Promise<Photobooth[]> {
    return this.photoboothRepository.find({
      where: {
        status: PhotoboothStatus.AVAILABLE,
        isActive: true,
      },
      order: { createdAt: 'ASC' },
    });
  }

  async create(createPhotoboothDto: CreatePhotoboothDto): Promise<Photobooth> {
    // Check if name already exists
    const existingPhotobooth = await this.photoboothRepository.findOne({
      where: { name: createPhotoboothDto.name },
    });

    if (existingPhotobooth) {
      throw new ConflictException('Photobooth name already exists');
    }

    const photobooth = this.photoboothRepository.create({
      ...createPhotoboothDto,
      status: createPhotoboothDto.status || PhotoboothStatus.AVAILABLE,
    });

    return this.photoboothRepository.save(photobooth);
  }

  async update(
    id: string,
    updatePhotoboothDto: UpdatePhotoboothDto,
  ): Promise<Photobooth> {
    const photobooth = await this.findOne(id);

    // Check if name already exists (if name is being updated)
    if (updatePhotoboothDto.name && updatePhotoboothDto.name !== photobooth.name) {
      const existingPhotobooth = await this.photoboothRepository.findOne({
        where: { name: updatePhotoboothDto.name },
      });

      if (existingPhotobooth) {
        throw new ConflictException('Photobooth name already exists');
      }
    }

    // Prevent changing status to AVAILABLE if there's an active session
    if (
      updatePhotoboothDto.status === PhotoboothStatus.AVAILABLE &&
      photobooth.currentSessionId
    ) {
      throw new BadRequestException(
        'Cannot set photobooth to available while there is an active session',
      );
    }

    Object.assign(photobooth, updatePhotoboothDto);
    return this.photoboothRepository.save(photobooth);
  }

  async remove(id: string): Promise<{ message: string }> {
    const photobooth = await this.findOne(id);

    // Check if there's an active session
    if (photobooth.currentSessionId) {
      throw new BadRequestException(
        'Cannot delete photobooth with active session',
      );
    }

    await this.photoboothRepository.remove(photobooth);
    return { message: `Photobooth with ID ${id} has been deleted` };
  }

  async setStatus(
    id: string,
    status: PhotoboothStatus,
  ): Promise<Photobooth> {
    const photobooth = await this.findOne(id);

    // Prevent setting to AVAILABLE if there's an active session
    if (status === PhotoboothStatus.AVAILABLE && photobooth.currentSessionId) {
      throw new BadRequestException(
        'Cannot set photobooth to available while there is an active session',
      );
    }

    photobooth.status = status;
    return this.photoboothRepository.save(photobooth);
  }

  async setCurrentSession(
    id: string,
    sessionId: string | null,
  ): Promise<Photobooth> {
    const photobooth = await this.findOne(id);
    photobooth.currentSessionId = sessionId;
    photobooth.status = sessionId ? PhotoboothStatus.BUSY : PhotoboothStatus.AVAILABLE;
    return this.photoboothRepository.save(photobooth);
  }

  async getStatus(): Promise<{
    total: number;
    available: number;
    busy: number;
    maintenance: number;
    offline: number;
  }> {
    const [total, available, busy, maintenance, offline] = await Promise.all([
      this.photoboothRepository.count(),
      this.photoboothRepository.count({
        where: { status: PhotoboothStatus.AVAILABLE, isActive: true },
      }),
      this.photoboothRepository.count({
        where: { status: PhotoboothStatus.BUSY },
      }),
      this.photoboothRepository.count({
        where: { status: PhotoboothStatus.MAINTENANCE },
      }),
      this.photoboothRepository.count({
        where: { status: PhotoboothStatus.OFFLINE },
      }),
    ]);

    return {
      total,
      available,
      busy,
      maintenance,
      offline,
    };
  }
}
