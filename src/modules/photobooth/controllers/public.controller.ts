import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { SessionService } from '../services/session.service';
import { PhotoService } from '../services/photo.service';
import { PhotoboothService } from '../services/photobooth.service';
import { CloudinaryService } from '../../photo/services/cloudinary.service';
import { PhotoboothGateway } from '../gateways/photobooth.gateway';
import {
  CreateSessionDto,
  StartSessionDto,
  CompleteSessionDto,
  SessionResponseDto,
} from '../dto/session.dto';
import { CreatePhotoDto, PhotoResponseDto } from '../dto/photo.dto';
import { PhotoboothResponseDto } from '../dto/photobooth.dto';
import {
  PaginationDto,
  PaginatedResponseDto,
} from '../../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('public-photobooth')
@Controller('api/v1/photobooth')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class PublicController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly photoService: PhotoService,
    private readonly photoboothService: PhotoboothService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly photoboothGateway: PhotoboothGateway,
  ) {}

  @Get('status')
  @ApiOperation({ summary: 'Get photobooth system status' })
  @ApiResponse({
    status: 200,
    description: 'System status retrieved successfully',
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
      },
    },
  })
  async getSystemStatus() {
    const [photobooths, sessions] = await Promise.all([
      this.photoboothService.getStatus(),
      this.sessionService.getSessionStats(),
    ]);

    return {
      photobooths,
      sessions,
    };
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available photobooths' })
  @ApiResponse({
    status: 200,
    description: 'Available photobooths retrieved successfully',
    type: [PhotoboothResponseDto],
  })
  async getAvailablePhotobooths() {
    return this.photoboothService.findAvailable();
  }

  @Post('sessions')
  @ApiOperation({
    summary: 'Create new photo session (requires authentication)',
  })
  @ApiBody({ type: CreateSessionDto })
  @ApiResponse({
    status: 201,
    description: 'Session created successfully',
    type: SessionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - Photobooth not available or user has active session',
  })
  async createSession(
    @Body() createSessionDto: CreateSessionDto,
    @Request() req: any,
  ) {
    const session = await this.sessionService.create(createSessionDto, req.user?.id);
    
    // Emit WebSocket message to all connected clients
    if (req.user?.id) {
      this.photoboothGateway.emitStartSession(req.user.id);
    }
    
    return session;
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get session by ID' })
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
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSession(@Param('id') id: string) {
    return this.sessionService.findOne(id);
  }

  @Put('sessions/:id/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start photo session' })
  @ApiParam({
    name: 'id',
    description: 'Session ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: StartSessionDto })
  @ApiResponse({
    status: 200,
    description: 'Session started successfully',
    type: SessionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async startSession(
    @Param('id') id: string,
    @Body() startSessionDto: StartSessionDto,
  ) {
    return this.sessionService.startSession(id, startSessionDto);
  }

  @Put('sessions/:id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete photo session' })
  @ApiParam({
    name: 'id',
    description: 'Session ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: CompleteSessionDto })
  @ApiResponse({
    status: 200,
    description: 'Session completed successfully',
    type: SessionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async completeSession(
    @Param('id') id: string,
    @Body() completeSessionDto: CompleteSessionDto,
  ) {
    // Get session info before completing to emit WebSocket message
    const session = await this.sessionService.findOne(id);
    const userId = session.userId;
    
    // Complete session
    const result = await this.sessionService.completeSession(id, completeSessionDto);
    
    // Emit WebSocket message to all connected clients
    if (userId) {
      this.photoboothGateway.emitStopSession(userId);
    }
    
    return result;
  }

  @Put('sessions/:id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel photo session' })
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
  @ApiResponse({ status: 400, description: 'Bad request' })
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

  @Get('sessions/:id/photos')
  @ApiOperation({ summary: 'Get session photos' })
  @ApiParam({
    name: 'id',
    description: 'Session ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
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
  @ApiResponse({
    status: 200,
    description: 'Session photos retrieved successfully',
    type: PaginatedResponseDto<PhotoResponseDto>,
  })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async getSessionPhotos(
    @Param('id') sessionId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.photoService.findBySessionPaginated(sessionId, paginationDto);
  }

  @Post('sessions/:id/photos')
  @ApiOperation({ summary: 'Add photo to session' })
  @ApiParam({
    name: 'id',
    description: 'Session ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: CreatePhotoDto })
  @ApiResponse({
    status: 201,
    description: 'Photo added successfully',
    type: PhotoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async addPhotoToSession(
    @Param('id') sessionId: string,
    @Body() createPhotoDto: CreatePhotoDto,
  ) {
    return this.photoService.create({
      ...createPhotoDto,
      sessionId,
    });
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload image file and get URL' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        imageUrl: {
          type: 'string',
          description: 'URL of the uploaded image',
          example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
        },
        publicId: {
          type: 'string',
          description: 'Public ID for the uploaded image',
          example: 'photobooth/upload/1234567890',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid file' })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: /^image\/(jpeg|jpg|png|gif|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // Upload to Cloudinary
    const folder = 'photoboth/uploads';
    const imageUrl = await this.cloudinaryService.uploadImage(file, folder);
    const publicId = this.cloudinaryService.extractPublicId(imageUrl);
    
    return {
      imageUrl,
      publicId,
    };
  }

  @Get('photos/:id')
  @ApiOperation({ summary: 'Get photo by ID' })
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
  @ApiResponse({ status: 404, description: 'Photo not found' })
  async getPhoto(@Param('id') id: string) {
    return this.photoService.findOne(id);
  }
}
