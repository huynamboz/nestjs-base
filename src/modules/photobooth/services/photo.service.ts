import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../entities/photo.entity';
import { Session } from '../entities/session.entity';
import {
  CreatePhotoDto,
  UpdatePhotoDto,
  PhotoResponseDto,
} from '../dto/photo.dto';
import { SessionStatus } from '../enums/session-status.enum';
import {
  PaginationDto,
  PaginatedResponseDto,
} from '../../../common/dto/pagination.dto';
import { PaginationService } from '../../../common/services/pagination.service';


@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(): Promise<Photo[]> {
    return this.photoRepository.find({
      relations: ['session'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllPaginated(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Photo>> {
    const searchFields = ['caption'];
    return this.paginationService.getPaginatedResults(
      this.photoRepository,
      paginationDto,
      searchFields,
    );
  }

  async findOne(id: string): Promise<Photo> {
    const photo = await this.photoRepository.findOne({
      where: { id },
      relations: ['session'],
    });

    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    return photo;
  }

  async findBySession(sessionId: string): Promise<Photo[]> {
    return this.photoRepository.find({
      where: { sessionId },
      relations: ['session'],
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async findBySessionPaginated(
    sessionId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Photo>> {
    const searchFields = ['caption'];
    return this.paginationService.getPaginatedResults(
      this.photoRepository,
      paginationDto,
      searchFields,
      { sessionId },
    );
  }

  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    const { sessionId, imageUrl, publicId, thumbnailUrl, order, caption } =
      createPhotoDto;

    // Check if session exists and is active
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (session.status !== SessionStatus.ACTIVE) {
      throw new BadRequestException('Cannot add photo to inactive session');
    }

    // Check if session has reached max photos
    if (session.photoCount >= session.maxPhotos) {
      throw new BadRequestException(
        `Session has reached maximum photos limit (${session.maxPhotos})`,
      );
    }

    // Get next order number if not provided
    let photoOrder = order;
    if (!photoOrder) {
      const lastPhoto = await this.photoRepository.findOne({
        where: { sessionId },
        order: { order: 'DESC' },
      });
      photoOrder = lastPhoto ? lastPhoto.order + 1 : 1;
    }

    // Create photo
    const photo = this.photoRepository.create({
      sessionId,
      imageUrl,
      publicId,
      thumbnailUrl,
      order: photoOrder,
      caption,
    });

    const savedPhoto = await this.photoRepository.save(photo);

    // Update session photo count
    await this.sessionRepository.update(sessionId, {
      photoCount: session.photoCount + 1,
    });

    return this.findOne(savedPhoto.id);
  }


  async update(id: string, updatePhotoDto: UpdatePhotoDto): Promise<Photo> {
    const photo = await this.findOne(id);

    // Check if session is still active
    if (photo.session.status !== SessionStatus.ACTIVE) {
      throw new BadRequestException('Cannot update photo in inactive session');
    }

    Object.assign(photo, updatePhotoDto);

    // Update processed timestamp if isProcessed is being set to true
    if (updatePhotoDto.isProcessed === true && !photo.isProcessed) {
      photo.processedAt = new Date();
    }

    await this.photoRepository.save(photo);

    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const photo = await this.findOne(id);

    // Check if session is still active
    if (photo.session.status !== SessionStatus.ACTIVE) {
      throw new BadRequestException('Cannot delete photo from inactive session');
    }

    await this.photoRepository.remove(photo);

    // Update session photo count
    const session = await this.sessionRepository.findOne({
      where: { id: photo.sessionId },
    });
    if (session) {
      await this.sessionRepository.update(photo.sessionId, {
        photoCount: Math.max(0, session.photoCount - 1),
      });
    }

    return { message: `Photo with ID ${id} has been deleted` };
  }

  async reorderPhotos(sessionId: string, photoIds: string[]): Promise<Photo[]> {
    // Check if session exists and is active
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (session.status !== SessionStatus.ACTIVE) {
      throw new BadRequestException('Cannot reorder photos in inactive session');
    }

    // Get all photos for the session
    const photos = await this.photoRepository.find({
      where: { sessionId },
      order: { order: 'ASC' },
    });

    // Check if all provided photo IDs exist in the session
    const existingPhotoIds = photos.map((photo) => photo.id);
    const invalidIds = photoIds.filter((id) => !existingPhotoIds.includes(id));
    if (invalidIds.length > 0) {
      throw new BadRequestException(
        `Invalid photo IDs: ${invalidIds.join(', ')}`,
      );
    }

    // Update order for each photo
    for (let i = 0; i < photoIds.length; i++) {
      await this.photoRepository.update(photoIds[i], { order: i + 1 });
    }

    // Return updated photos
    return this.findBySession(sessionId);
  }

  async getPhotoStats(): Promise<{
    total: number;
    processed: number;
    unprocessed: number;
    bySession: { [sessionId: string]: number };
  }> {
    const [total, processed, unprocessed] = await Promise.all([
      this.photoRepository.count(),
      this.photoRepository.count({ where: { isProcessed: true } }),
      this.photoRepository.count({ where: { isProcessed: false } }),
    ]);

    // Get photo count by session
    const sessionStats = await this.photoRepository
      .createQueryBuilder('photo')
      .select('photo.sessionId')
      .addSelect('COUNT(photo.id)', 'count')
      .groupBy('photo.sessionId')
      .getRawMany();

    const bySession = sessionStats.reduce((acc, stat) => {
      acc[stat.photo_sessionId] = parseInt(stat.count);
      return acc;
    }, {} as { [sessionId: string]: number });

    return {
      total,
      processed,
      unprocessed,
      bySession,
    };
  }
}
