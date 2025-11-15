import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SessionService } from '../services/session.service';
import { PhotoService } from '../services/photo.service';
import { PhotoboothService } from '../services/photobooth.service';
import { PhotoboothGateway } from '../gateways/photobooth.gateway';
import {
  CreateSessionDto,
  UpdateSessionDto,
  SessionResponseDto,
  AddFilterDto,
  DeleteFilterDto,
} from '../dto/session.dto';
import {
  CreatePhotoDto,
  UpdatePhotoDto,
  PhotoResponseDto,
} from '../dto/photo.dto';
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
import { AdminSessionQueryDto } from '../dto/admin-session-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RoleName } from '../../auth/entities/role.entity';

@ApiTags('admin-photobooth')
@Controller('api/v1/admin/photobooth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly photoService: PhotoService,
    private readonly photoboothService: PhotoboothService,
    private readonly photoboothGateway: PhotoboothGateway,
  ) {}

  // Photobooth Management
  @Get('photobooths')
  @ApiOperation({ summary: 'Get all photobooths with pagination (Admin only)' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (starts from 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (max 100)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for filtering photobooths',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of photobooths retrieved successfully',
    type: PaginatedResponseDto<PhotoboothResponseDto>,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getPhotobooths(@Query() paginationDto: PaginationDto) {
    return this.photoboothService.findAllPaginated(paginationDto);
  }

  @Get('photobooths/:id')
  @ApiOperation({ summary: 'Get photobooth by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Photobooth ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Photobooth retrieved successfully',
    type: PhotoboothResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Photobooth not found' })
  async getPhotobooth(@Param('id') id: string) {
    return this.photoboothService.findOne(id);
  }

  @Post('photobooths')
  @ApiOperation({ summary: 'Create new photobooth (Admin only)' })
  @ApiBody({ type: CreatePhotoboothDto })
  @ApiResponse({
    status: 201,
    description: 'Photobooth created successfully',
    type: PhotoboothResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 409, description: 'Conflict - Name already exists' })
  async createPhotobooth(@Body() createPhotoboothDto: CreatePhotoboothDto) {
    return this.photoboothService.create(createPhotoboothDto);
  }

  @Put('photobooths/:id')
  @ApiOperation({ summary: 'Update photobooth (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Photobooth ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdatePhotoboothDto })
  @ApiResponse({
    status: 200,
    description: 'Photobooth updated successfully',
    type: PhotoboothResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Photobooth not found' })
  async updatePhotobooth(
    @Param('id') id: string,
    @Body() updatePhotoboothDto: UpdatePhotoboothDto,
  ) {
    return this.photoboothService.update(id, updatePhotoboothDto);
  }

  @Put('photobooths/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update photobooth status (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Photobooth ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(PhotoboothStatus),
          example: PhotoboothStatus.MAINTENANCE,
        },
      },
      required: ['status'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Photobooth status updated successfully',
    type: PhotoboothResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Photobooth not found' })
  async updatePhotoboothStatus(
    @Param('id') id: string,
    @Body('status') status: PhotoboothStatus,
  ) {
    return this.photoboothService.setStatus(id, status);
  }

  @Put('photobooths/:id/clear-session')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Clear current session from photobooth (Admin only)',
    description: 'Manually clear the current session from a photobooth to make it available'
  })
  @ApiParam({
    name: 'id',
    description: 'Photobooth ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Photobooth session cleared successfully',
    type: PhotoboothResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Photobooth not found' })
  async clearPhotoboothSession(@Param('id') id: string) {
    return this.photoboothService.setCurrentSession(id, null);
  }

  @Delete('photobooths/:id')
  @ApiOperation({ summary: 'Delete photobooth (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Photobooth ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Photobooth deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Photobooth with ID 123e4567-e89b-12d3-a456-426614174000 has been deleted',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Photobooth not found' })
  async deletePhotobooth(@Param('id') id: string) {
    return this.photoboothService.remove(id);
  }

  // Session Management
  @Get('sessions')
  @ApiOperation({ summary: 'Get all sessions with pagination and filtering (Admin only)' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (starts from 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (max 100)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for filtering sessions',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    description: 'Filter by session status',
  })
  @ApiQuery({
    name: 'photoboothId',
    required: false,
    type: String,
    description: 'Filter by photobooth ID (UUID)',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    type: String,
    description: 'Filter sessions from this date (ISO 8601 format)',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    type: String,
    description: 'Filter sessions to this date (ISO 8601 format)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of sessions retrieved successfully',
    type: PaginatedResponseDto<SessionResponseDto>,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getSessions(@Query() queryDto: AdminSessionQueryDto) {
    return this.sessionService.findAllPaginatedWithFilters(queryDto);
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get session by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Session ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Session retrieved successfully',
    type: SessionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSession(@Param('id') id: string) {
    return this.sessionService.findOne(id);
  }

  @Put('sessions/:id')
  @ApiOperation({ summary: 'Update session (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Session ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateSessionDto })
  @ApiResponse({
    status: 200,
    description: 'Session updated successfully',
    type: SessionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async updateSession(
    @Param('id') id: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Delete('sessions/:id')
  @ApiOperation({ summary: 'Delete session (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Session ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Session deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Session with ID 123e4567-e89b-12d3-a456-426614174000 has been deleted',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async deleteSession(@Param('id') id: string) {
    // Get session info before deleting to emit WebSocket message
    const session = await this.sessionService.findOne(id);
    const userId = session.userId;
    
    // Delete session
    const result = await this.sessionService.remove(id);
    
    // Emit WebSocket message to all connected clients
    if (userId) {
      this.photoboothGateway.emitStopSession(userId);
    }
    
    return result;
  }

  @Put('sessions/:id/cancel')
  @ApiOperation({
    summary: 'Cancel session (Admin only)',
    description: 'Cancel an active or pending session when user does not complete it',
  })
  @ApiParam({
    name: 'id',
    description: 'Session ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Session cancelled successfully',
    type: SessionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Cannot cancel completed session' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async cancelSession(@Param('id') id: string) {
    // Get session info before cancelling to emit WebSocket message
    const session = await this.sessionService.findOne(id);
    const userId = session.userId;
    
    // Cancel session
    const result = await this.sessionService.cancelSession(id);
    
    // Emit WebSocket message to all connected clients
    if (userId) {
      this.photoboothGateway.emitStopSession(userId);
    }
    
    return result;
  }

  @Post('sessions/:id/filters')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add filter to session (Admin only)',
    description: 'Add a filter ID to the session filterIds array',
  })
  @ApiParam({
    name: 'id',
    description: 'Session ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: AddFilterDto })
  @ApiResponse({
    status: 200,
    description: 'Filter added to session successfully',
    type: SessionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Cannot add filter to completed or cancelled session' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 409, description: 'Filter already exists in session' })
  async addFilter(
    @Param('id') id: string,
    @Body() addFilterDto: AddFilterDto,
  ) {
    // Add filter to session
    const result = await this.sessionService.addFilter(id, addFilterDto.filterId);
    
    // Emit WebSocket message to all connected clients
    this.photoboothGateway.emitAddFilter(addFilterDto.filterId);
    
    return result;
  }

  @Delete('sessions/:id/filters/:filterId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove filter from session (Admin only)',
    description: 'Remove a filter ID from the session filterIds array',
  })
  @ApiParam({
    name: 'id',
    description: 'Session ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'filterId',
    description: 'Filter ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Filter removed from session successfully',
    type: SessionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - Cannot remove filter from completed or cancelled session' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Session or filter not found' })
  async deleteFilter(
    @Param('id') id: string,
    @Param('filterId') filterId: string,
  ) {
    // Remove filter from session
    const result = await this.sessionService.removeFilter(id, filterId);
    
    // Emit WebSocket message to all connected clients
    this.photoboothGateway.emitDeleteFilter(filterId);
    
    return result;
  }

  // Photo Management
  @Get('photos')
  @ApiOperation({ summary: 'Get all photos with pagination (Admin only)' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (starts from 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (max 100)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for filtering photos',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of photos retrieved successfully',
    type: PaginatedResponseDto<PhotoResponseDto>,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getPhotos(@Query() paginationDto: PaginationDto) {
    return this.photoService.findAllPaginated(paginationDto);
  }

  @Get('photos/:id')
  @ApiOperation({ summary: 'Get photo by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Photo ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Photo retrieved successfully',
    type: PhotoResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  async getPhoto(@Param('id') id: string) {
    return this.photoService.findOne(id);
  }

  @Put('photos/:id')
  @ApiOperation({ summary: 'Update photo (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Photo ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdatePhotoDto })
  @ApiResponse({
    status: 200,
    description: 'Photo updated successfully',
    type: PhotoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  async updatePhoto(
    @Param('id') id: string,
    @Body() updatePhotoDto: UpdatePhotoDto,
  ) {
    return this.photoService.update(id, updatePhotoDto);
  }

  @Delete('photos/:id')
  @ApiOperation({ summary: 'Delete photo (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Photo ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Photo deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Photo with ID 123e4567-e89b-12d3-a456-426614174000 has been deleted',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  async deletePhoto(@Param('id') id: string) {
    return this.photoService.remove(id);
  }

  // System Management
  @Get('stats')
  @ApiOperation({ summary: 'Get system statistics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'System statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        photobooths: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            available: { type: 'number' },
            busy: { type: 'number' },
            maintenance: { type: 'number' },
            offline: { type: 'number' },
          },
        },
        sessions: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            pending: { type: 'number' },
            active: { type: 'number' },
            completed: { type: 'number' },
            cancelled: { type: 'number' },
            expired: { type: 'number' },
          },
        },
        photos: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            processed: { type: 'number' },
            unprocessed: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getSystemStats() {
    const [photobooths, sessions, photos] = await Promise.all([
      this.photoboothService.getStatus(),
      this.sessionService.getSessionStats(),
      this.photoService.getPhotoStats(),
    ]);

    return {
      photobooths,
      sessions,
      photos,
    };
  }

  @Post('cleanup/expired-sessions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cleanup expired sessions (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Expired sessions cleaned up successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '5 expired sessions cleaned up' },
        count: { type: 'number', example: 5 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async cleanupExpiredSessions() {
    const count = await this.sessionService.cleanupExpiredSessions();
    return {
      message: `${count} expired sessions cleaned up`,
      count,
    };
  }
}
