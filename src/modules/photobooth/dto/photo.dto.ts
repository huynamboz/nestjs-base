import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreatePhotoDto {
  @ApiPropertyOptional({
    description: 'Session ID (auto-filled when called from session endpoint)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Session ID must be a valid UUID' })
  sessionId?: string;

  @ApiProperty({
    description: 'Image URL',
    example: 'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/photobooth/session1/photo1.jpg',
  })
  @IsString({ message: 'Image URL must be a string' })
  imageUrl: string;

  @ApiPropertyOptional({
    description: 'Cloudinary public ID',
    example: 'photobooth/session1/photo1',
  })
  @IsOptional()
  @IsString({ message: 'Public ID must be a string' })
  publicId?: string;

  @ApiPropertyOptional({
    description: 'Thumbnail URL',
    example: 'https://res.cloudinary.com/your-cloud/image/upload/w_300,h_300/v1234567890/photobooth/session1/photo1.jpg',
  })
  @IsOptional()
  @IsString({ message: 'Thumbnail URL must be a string' })
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: 'Photo order in session',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Order must be a number' })
  @Min(1, { message: 'Order must be at least 1' })
  order?: number;

  @ApiPropertyOptional({
    description: 'Photo caption',
    example: 'First photo of the session',
  })
  @IsOptional()
  @IsString({ message: 'Caption must be a string' })
  caption?: string;
}

export class UpdatePhotoDto {
  @ApiPropertyOptional({
    description: 'Photo caption',
    example: 'Updated caption',
  })
  @IsOptional()
  @IsString({ message: 'Caption must be a string' })
  caption?: string;

  @ApiPropertyOptional({
    description: 'Photo order in session',
    example: 2,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Order must be a number' })
  @Min(1, { message: 'Order must be at least 1' })
  order?: number;

  @ApiPropertyOptional({
    description: 'Is photo processed',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Is processed must be a boolean' })
  isProcessed?: boolean;
}

export class PhotoResponseDto {
  @ApiProperty({
    description: 'Photo ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Session ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  sessionId: string;

  @ApiProperty({
    description: 'Image URL',
    example: 'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/photobooth/session1/photo1.jpg',
  })
  imageUrl: string;

  @ApiPropertyOptional({
    description: 'Cloudinary public ID',
    example: 'photobooth/session1/photo1',
  })
  publicId?: string;

  @ApiPropertyOptional({
    description: 'Thumbnail URL',
    example: 'https://res.cloudinary.com/your-cloud/image/upload/w_300,h_300/v1234567890/photobooth/session1/photo1.jpg',
  })
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Photo order in session',
    example: 1,
  })
  order: number;

  @ApiPropertyOptional({
    description: 'Photo caption',
    example: 'First photo of the session',
  })
  caption?: string;

  @ApiProperty({
    description: 'Is photo processed',
    example: false,
  })
  isProcessed: boolean;

  @ApiPropertyOptional({
    description: 'Photo processing time',
    example: '2024-01-01T10:15:00.000Z',
  })
  processedAt?: Date;

  @ApiProperty({
    description: 'Photo creation time',
    example: '2024-01-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Photo last update time',
    example: '2024-01-01T10:15:00.000Z',
  })
  updatedAt: Date;
}
