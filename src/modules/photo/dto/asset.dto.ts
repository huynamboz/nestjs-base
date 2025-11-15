import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { AssetType } from '../entities/asset.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class CreateAssetDto {
  @ApiProperty({
    description: 'Asset type',
    enum: AssetType,
    example: AssetType.FRAME,
  })
  @IsEnum(AssetType, { message: 'Type must be a valid asset type' })
  type: AssetType;

  @ApiPropertyOptional({
    description: 'Filter type (cute/cool/poetic) - only for filter type',
    example: 'cool',
  })
  @IsOptional()
  @IsString()
  @IsIn(['cute', 'cool', 'poetic'], {
    message: 'Filter type must be one of: cute, cool, poetic',
  })
  filterType?: string;

  @ApiPropertyOptional({
    description: 'Scale value',
    example: 2.5,
  })
  @IsOptional()
  @IsNumber()
  scale?: number;

  @ApiPropertyOptional({
    description: 'Offset Y value',
    example: -100,
  })
  @IsOptional()
  @IsNumber()
  offset_y?: number;

  @ApiPropertyOptional({
    description: 'Anchor index',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  anchor_idx?: number;

  @ApiPropertyOptional({
    description: 'Left index',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  left_idx?: number;

  @ApiPropertyOptional({
    description: 'Right index',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  right_idx?: number;
}

export class UploadAssetDto {
  @ApiProperty({
    description: 'Asset type',
    enum: AssetType,
    example: AssetType.FRAME,
  })
  @IsEnum(AssetType, { message: 'Type must be a valid asset type' })
  type: AssetType;

  @ApiPropertyOptional({
    description: 'Filter type (cute/cool/poetic) - only for filter type',
    example: 'cool',
  })
  @IsOptional()
  @IsString()
  @IsIn(['cute', 'cool', 'poetic'], {
    message: 'Filter type must be one of: cute, cool, poetic',
  })
  filterType?: string;

  @ApiPropertyOptional({
    description: 'Scale value',
    example: 2.5,
  })
  @IsOptional()
  @IsNumber()
  scale?: number;

  @ApiPropertyOptional({
    description: 'Offset Y value',
    example: -100,
  })
  @IsOptional()
  @IsNumber()
  offset_y?: number;

  @ApiPropertyOptional({
    description: 'Anchor index',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  anchor_idx?: number;

  @ApiPropertyOptional({
    description: 'Left index',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  left_idx?: number;

  @ApiPropertyOptional({
    description: 'Right index',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  right_idx?: number;
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

  @ApiPropertyOptional({
    description: 'Filter type (cute/cool/poetic) - only for filter type',
    example: 'cool',
  })
  filterType?: string;

  @ApiPropertyOptional({
    description: 'Scale value',
    example: 2.5,
  })
  scale?: number;

  @ApiPropertyOptional({
    description: 'Offset Y value',
    example: -100,
  })
  offset_y?: number;

  @ApiPropertyOptional({
    description: 'Anchor index',
    example: 10,
  })
  anchor_idx?: number;

  @ApiPropertyOptional({
    description: 'Left index',
    example: 10,
  })
  left_idx?: number;

  @ApiPropertyOptional({
    description: 'Right index',
    example: 10,
  })
  right_idx?: number;

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

export class AssetQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by asset type',
    enum: AssetType,
    example: AssetType.FRAME,
  })
  @IsOptional()
  @IsEnum(AssetType, { message: 'Type must be a valid asset type' })
  type?: AssetType;
}
