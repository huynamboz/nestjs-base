import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { SessionStatus } from '../enums/session-status.enum';

export class CreateSessionDto {
  @ApiProperty({
    description: 'Photobooth ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Photobooth ID must be a valid UUID' })
  photoboothId: string;

  @ApiPropertyOptional({
    description: 'Maximum number of photos allowed',
    example: 5,
    minimum: 1,
    maximum: 20,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Max photos must be a number' })
  @Min(1, { message: 'Max photos must be at least 1' })
  @Max(20, { message: 'Max photos cannot exceed 20' })
  maxPhotos?: number;

  @ApiPropertyOptional({
    description: 'Session notes',
    example: 'Birthday party session',
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}

export class UpdateSessionDto {
  @ApiPropertyOptional({
    description: 'Session status',
    enum: SessionStatus,
    example: SessionStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(SessionStatus, { message: 'Status must be a valid session status' })
  status?: SessionStatus;

  @ApiPropertyOptional({
    description: 'Session notes',
    example: 'Updated notes',
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}

export class StartSessionDto {
  @ApiPropertyOptional({
    description: 'Session start time (ISO string)',
    example: '2024-01-01T10:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Started at must be a valid date string' })
  startedAt?: string;
}

export class CompleteSessionDto {
  @ApiPropertyOptional({
    description: 'Session completion time (ISO string)',
    example: '2024-01-01T10:30:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Completed at must be a valid date string' })
  completedAt?: string;
}

export class ChangeFilterDto {
  @ApiProperty({
    description: 'Filter ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Filter ID must be a valid UUID' })
  filterId: string;
}

export class AddFilterDto {
  @ApiProperty({
    description: 'Filter ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Filter ID must be a valid UUID' })
  filterId: string;
}

export class DeleteFilterDto {
  @ApiProperty({
    description: 'Filter ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Filter ID must be a valid UUID' })
  filterId: string;
}

export class SessionResponseDto {
  @ApiProperty({
    description: 'Session ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Session status',
    enum: SessionStatus,
    example: SessionStatus.ACTIVE,
  })
  status: SessionStatus;

  @ApiPropertyOptional({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId?: string;

  @ApiPropertyOptional({
    description: 'User information',
    type: 'object',
    properties: {
      id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      email: { type: 'string', example: 'user@example.com' },
      name: { type: 'string', example: 'John Doe' },
      role: { 
        type: 'object', 
        properties: {
          id: { type: 'string', example: '456e7890-e89b-12d3-a456-426614174001' },
          name: { type: 'string', example: 'user' }
        }
      }
    }
  })
  user?: {
    id: string;
    email: string;
    name: string;
    role?: {
      id: string;
      name: string;
    };
  };

  @ApiProperty({
    description: 'Photobooth ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  photoboothId: string;

  @ApiPropertyOptional({
    description: 'Photobooth information',
    type: 'object',
    properties: {
      id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      name: { type: 'string', example: 'Photobooth #1' },
      status: { type: 'string', example: 'available' },
      location: { type: 'string', example: 'Entrance Hall' }
    }
  })
  photobooth?: {
    id: string;
    name: string;
    status: string;
    location?: string;
  };

  @ApiProperty({
    description: 'Number of photos taken',
    example: 3,
  })
  photoCount: number;

  @ApiProperty({
    description: 'Maximum photos allowed',
    example: 5,
  })
  maxPhotos: number;

  @ApiPropertyOptional({
    description: 'Session start time',
    example: '2024-01-01T10:00:00.000Z',
  })
  startedAt?: Date;

  @ApiPropertyOptional({
    description: 'Session completion time',
    example: '2024-01-01T10:30:00.000Z',
  })
  completedAt?: Date;

  @ApiPropertyOptional({
    description: 'Session expiration time',
    example: '2024-01-01T11:00:00.000Z',
  })
  expiresAt?: Date;

  @ApiPropertyOptional({
    description: 'Array of filter IDs',
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000', '456e7890-e89b-12d3-a456-426614174001'],
  })
  filterIds?: string[];

  @ApiPropertyOptional({
    description: 'Session notes',
    example: 'Birthday party session',
  })
  notes?: string;

  @ApiProperty({
    description: 'Session creation time',
    example: '2024-01-01T09:45:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Session last update time',
    example: '2024-01-01T10:30:00.000Z',
  })
  updatedAt: Date;
}
