import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { PhotoboothStatus } from '../enums/session-status.enum';

export class CreatePhotoboothDto {
  @ApiProperty({
    description: 'Photobooth name',
    example: 'Photobooth #1',
  })
  @IsString({ message: 'Name must be a string' })
  @MinLength(1, { message: 'Name must not be empty' })
  name: string;

  @ApiPropertyOptional({
    description: 'Photobooth description',
    example: 'Main photobooth at entrance',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Photobooth location',
    example: 'Entrance Hall',
  })
  @IsOptional()
  @IsString({ message: 'Location must be a string' })
  location?: string;

  @ApiPropertyOptional({
    description: 'Photobooth status',
    enum: PhotoboothStatus,
    example: PhotoboothStatus.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(PhotoboothStatus, { message: 'Status must be a valid photobooth status' })
  status?: PhotoboothStatus;
}

export class UpdatePhotoboothDto {
  @ApiPropertyOptional({
    description: 'Photobooth name',
    example: 'Photobooth #1 - Updated',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(1, { message: 'Name must not be empty' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Photobooth description',
    example: 'Updated description',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Photobooth location',
    example: 'Updated Location',
  })
  @IsOptional()
  @IsString({ message: 'Location must be a string' })
  location?: string;

  @ApiPropertyOptional({
    description: 'Photobooth status',
    enum: PhotoboothStatus,
    example: PhotoboothStatus.BUSY,
  })
  @IsOptional()
  @IsEnum(PhotoboothStatus, { message: 'Status must be a valid photobooth status' })
  status?: PhotoboothStatus;

  @ApiPropertyOptional({
    description: 'Is photobooth active',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Is active must be a boolean' })
  isActive?: boolean;
}

export class PhotoboothResponseDto {
  @ApiProperty({
    description: 'Photobooth ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Photobooth name',
    example: 'Photobooth #1',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Photobooth description',
    example: 'Main photobooth at entrance',
  })
  description?: string;

  @ApiProperty({
    description: 'Photobooth status',
    enum: PhotoboothStatus,
    example: PhotoboothStatus.AVAILABLE,
  })
  status: PhotoboothStatus;

  @ApiPropertyOptional({
    description: 'Photobooth location',
    example: 'Entrance Hall',
  })
  location?: string;

  @ApiProperty({
    description: 'Is photobooth active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Current session ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  currentSessionId?: string;

  @ApiProperty({
    description: 'Photobooth creation time',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Photobooth last update time',
    example: '2024-01-01T10:00:00.000Z',
  })
  updatedAt: Date;
}
