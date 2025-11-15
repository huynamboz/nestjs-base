import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { Photobooth } from '../entities/photobooth.entity';
import { Photo } from '../entities/photo.entity';
import {
  CreateSessionDto,
  UpdateSessionDto,
  StartSessionDto,
  CompleteSessionDto,
  SessionResponseDto,
} from '../dto/session.dto';
import { SessionStatus, PhotoboothStatus } from '../enums/session-status.enum';
import {
  PaginationDto,
  PaginatedResponseDto,
} from '../../../common/dto/pagination.dto';
import { AdminSessionQueryDto } from '../dto/admin-session-query.dto';
import { PaginationService } from '../../../common/services/pagination.service';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Photobooth)
    private readonly photoboothRepository: Repository<Photobooth>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(): Promise<Session[]> {
    return this.sessionRepository.find({
      relations: ['photobooth', 'user', 'photos'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllPaginated(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<Session>> {
    const { page = 1, limit = 10, search } = paginationDto;
    
    // Create query builder for search
    let queryBuilder = this.sessionRepository.createQueryBuilder('session')
      .leftJoinAndSelect('session.photobooth', 'photobooth')
      .leftJoinAndSelect('session.user', 'user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('session.photos', 'photos')
      .orderBy('session.createdAt', 'DESC');
    
    // Apply search if provided
    if (search) {
      queryBuilder.andWhere('session.notes ILIKE :search', { search: `%${search}%` });
    }
    
    // Get total count
    const total = await queryBuilder.getCount();
    
    // Apply pagination
    queryBuilder.skip((page - 1) * limit).take(limit);
    
    // Get data
    const data = await queryBuilder.getMany();
    
    // Create paginated response
    return this.paginationService.createPaginatedResponse(data, total, paginationDto);
  }

  async findAllPaginatedWithFilters(
    queryDto: AdminSessionQueryDto,
  ): Promise<PaginatedResponseDto<Session>> {
    const { page = 1, limit = 10, search, status, photoboothId, dateFrom, dateTo } = queryDto;
    
    // Create query builder for search and filters
    let queryBuilder = this.sessionRepository.createQueryBuilder('session')
      .leftJoinAndSelect('session.photobooth', 'photobooth')
      .leftJoinAndSelect('session.user', 'user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('session.photos', 'photos')
      .orderBy('session.createdAt', 'DESC');
    
    // Apply search if provided
    if (search) {
      queryBuilder.andWhere('session.notes ILIKE :search', { search: `%${search}%` });
    }
    
    // Apply status filter
    if (status) {
      queryBuilder.andWhere('session.status = :status', { status });
    }
    
    // Apply photobooth filter
    if (photoboothId) {
      queryBuilder.andWhere('session.photoboothId = :photoboothId', { photoboothId });
    }
    
    // Apply date range filters
    if (dateFrom) {
      queryBuilder.andWhere('session.createdAt >= :dateFrom', { 
        dateFrom: new Date(dateFrom + 'T00:00:00.000Z') 
      });
    }
    
    if (dateTo) {
      queryBuilder.andWhere('session.createdAt <= :dateTo', { 
        dateTo: new Date(dateTo + 'T23:59:59.999Z') 
      });
    }
    
    // Get total count
    const total = await queryBuilder.getCount();
    
    // Apply pagination
    queryBuilder.skip((page - 1) * limit).take(limit);
    
    // Get data
    const data = await queryBuilder.getMany();
    
    // Create paginated response
    return this.paginationService.createPaginatedResponse(data, total, queryDto);
  }

  async findOne(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['photobooth', 'user', 'photos'],
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return session;
  }

  async findByPhotobooth(photoboothId: string): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { photoboothId },
      relations: ['photobooth', 'user', 'photos'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { userId },
      relations: ['photobooth', 'photos'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByPhotobooth(photoboothId: string): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: {
        photoboothId,
        status: SessionStatus.ACTIVE,
      },
      relations: ['photobooth', 'user', 'photos'],
    });
  }

  async create(createSessionDto: CreateSessionDto, currentUserId?: string): Promise<Session> {
    const { photoboothId, maxPhotos = 5, notes } = createSessionDto;

    // User ID is required and must come from JWT token
    if (!currentUserId) {
      throw new BadRequestException('User ID is required to create a session. Please ensure you are authenticated.');
    }
    
    const sessionUserId = currentUserId;

    // Check if photobooth exists and is available
    const photobooth = await this.photoboothRepository.findOne({
      where: { id: photoboothId },
    });

    if (!photobooth) {
      throw new NotFoundException(`Photobooth with ID ${photoboothId} not found`);
    }

    if (photobooth.status !== PhotoboothStatus.AVAILABLE) {
      throw new ConflictException('Photobooth is not available');
    }

    if (photobooth.currentSessionId) {
      throw new ConflictException('Photobooth already has an active session');
    }

    // Check if user already has an active session
    const activeUserSession = await this.sessionRepository.findOne({
      where: {
        userId: sessionUserId,
        status: SessionStatus.ACTIVE,
      },
    });

    if (activeUserSession) {
      throw new ConflictException('User already has an active session');
    }

    // Create session
    const session = this.sessionRepository.create({
      photoboothId,
      userId: sessionUserId,
      maxPhotos,
      notes,
      status: SessionStatus.PENDING,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    });

    const savedSession = await this.sessionRepository.save(session);

    // Update photobooth status
    await this.photoboothRepository.update(photoboothId, {
      status: PhotoboothStatus.BUSY,
      currentSessionId: savedSession.id,
    });

    return this.findOne(savedSession.id);
  }

  async startSession(
    id: string,
    startSessionDto: StartSessionDto = {},
  ): Promise<Session> {
    const session = await this.findOne(id);

    if (session.status !== SessionStatus.PENDING) {
      throw new BadRequestException('Session is not in pending status');
    }

    // Check if session has expired
    if (session.expiresAt && session.expiresAt < new Date()) {
      session.status = SessionStatus.EXPIRED;
      await this.sessionRepository.save(session);
      throw new BadRequestException('Session has expired');
    }

    // Update session
    session.status = SessionStatus.ACTIVE;
    session.startedAt = startSessionDto.startedAt
      ? new Date(startSessionDto.startedAt)
      : new Date();

    await this.sessionRepository.save(session);

    return this.findOne(id);
  }

  async completeSession(
    id: string,
    completeSessionDto: CompleteSessionDto = {},
  ): Promise<Session> {
    const session = await this.findOne(id);

    if (session.status !== SessionStatus.ACTIVE) {
      throw new BadRequestException('Session is not active');
    }

    // Update session
    session.status = SessionStatus.COMPLETED;
    session.completedAt = completeSessionDto.completedAt
      ? new Date(completeSessionDto.completedAt)
      : new Date();

    await this.sessionRepository.save(session);

    // Update photobooth status
    await this.photoboothRepository.update(session.photoboothId, {
      status: PhotoboothStatus.AVAILABLE,
      currentSessionId: null,
    });

    return this.findOne(id);
  }

  async cancelSession(id: string): Promise<Session> {
    const session = await this.findOne(id);

    if (session.status === SessionStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed session');
    }

    // Update session
    session.status = SessionStatus.CANCELLED;
    await this.sessionRepository.save(session);

    // Update photobooth status
    await this.photoboothRepository.update(session.photoboothId, {
      status: PhotoboothStatus.AVAILABLE,
      currentSessionId: null,
    });

    return this.findOne(id);
  }

  async update(
    id: string,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    const session = await this.findOne(id);

    // Prevent updating completed or cancelled sessions
    if (
      session.status === SessionStatus.COMPLETED ||
      session.status === SessionStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cannot update completed or cancelled session',
      );
    }

    Object.assign(session, updateSessionDto);
    await this.sessionRepository.save(session);

    return this.findOne(id);
  }

  async changeFilter(id: string, filterId: string): Promise<Session> {
    const session = await this.findOne(id);

    // Prevent updating completed or cancelled sessions
    if (
      session.status === SessionStatus.COMPLETED ||
      session.status === SessionStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cannot change filter for completed or cancelled session',
      );
    }

    session.filterId = filterId;
    await this.sessionRepository.save(session);

    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const session = await this.findOne(id);

    // Prevent deleting active sessions
    if (session.status === SessionStatus.ACTIVE) {
      throw new BadRequestException('Cannot delete active session');
    }

    // Update photobooth status if it was the current session
    if (session.photobooth.currentSessionId === id) {
      await this.photoboothRepository.update(session.photoboothId, {
        status: PhotoboothStatus.AVAILABLE,
        currentSessionId: null,
      });
    }

    await this.sessionRepository.remove(session);
    return { message: `Session with ID ${id} has been deleted` };
  }

  async getSessionStats(): Promise<{
    total: number;
    pending: number;
    active: number;
    completed: number;
    cancelled: number;
    expired: number;
  }> {
    const [total, pending, active, completed, cancelled, expired] =
      await Promise.all([
        this.sessionRepository.count(),
        this.sessionRepository.count({
          where: { status: SessionStatus.PENDING },
        }),
        this.sessionRepository.count({
          where: { status: SessionStatus.ACTIVE },
        }),
        this.sessionRepository.count({
          where: { status: SessionStatus.COMPLETED },
        }),
        this.sessionRepository.count({
          where: { status: SessionStatus.CANCELLED },
        }),
        this.sessionRepository.count({
          where: { status: SessionStatus.EXPIRED },
        }),
      ]);

    return {
      total,
      pending,
      active,
      completed,
      cancelled,
      expired,
    };
  }

  async cleanupExpiredSessions(): Promise<number> {
    const expiredSessions = await this.sessionRepository.find({
      where: {
        status: SessionStatus.PENDING,
        expiresAt: { $lt: new Date() } as any,
      },
    });

    for (const session of expiredSessions) {
      session.status = SessionStatus.EXPIRED;
      await this.sessionRepository.save(session);

      // Update photobooth status
      await this.photoboothRepository.update(session.photoboothId, {
        status: PhotoboothStatus.AVAILABLE,
        currentSessionId: null,
      });
    }

    return expiredSessions.length;
  }
}
