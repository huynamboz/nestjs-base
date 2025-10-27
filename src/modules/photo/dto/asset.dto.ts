import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AssetType } from '../entities/asset.entity';

export class CreateAssetDto {
  @ApiProperty({
    description: 'Asset type',
    enum: AssetType,
    example: AssetType.FRAME,
  })
  @IsEnum(AssetType, { message: 'Type must be a valid asset type' })
  type: AssetType;
}

export class UploadAssetDto {
  @ApiProperty({
    description: 'Asset type',
    enum: AssetType,
    example: AssetType.FRAME,
  })
  @IsEnum(AssetType, { message: 'Type must be a valid asset type' })
  type: AssetType;
}

export class AssetResponseDto {
  @ApiProperty({
    description: 'Asset ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Image URL',
    example:
      'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/photoboth/frame1.png',
  })
  imageUrl: string;

  @ApiPropertyOptional({
    description: 'Cloudinary public ID',
    example: 'photoboth/frame1',
  })
  publicId?: string;

  @ApiProperty({
    description: 'Asset type',
    enum: AssetType,
    example: AssetType.FRAME,
  })
  type: AssetType;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
