import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AssetService } from '../services/asset.service';
import { AssetResponseDto } from '../dto/asset.dto';
import { AssetType } from '../entities/asset.entity';

@ApiTags('public-assets')
@Controller('api/v1/assets')
export class PublicController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  @ApiOperation({ summary: 'Get all assets (public)' })
  @ApiResponse({
    status: 200,
    description: 'List of all assets retrieved successfully',
    type: [AssetResponseDto],
  })
  async findAll() {
    return this.assetService.findAll();
  }

  @Get('frames')
  @ApiOperation({ summary: 'Get all frames (public)' })
  @ApiResponse({
    status: 200,
    description: 'List of frames retrieved successfully',
    type: [AssetResponseDto],
  })
  async getFrames() {
    return this.assetService.findByType(AssetType.FRAME);
  }

  @Get('filters')
  @ApiOperation({ summary: 'Get all filters (public)' })
  @ApiResponse({
    status: 200,
    description: 'List of filters retrieved successfully',
    type: [AssetResponseDto],
  })
  async getFilters() {
    return this.assetService.findByType(AssetType.FILTER);
  }

  @Get('stickers')
  @ApiOperation({ summary: 'Get all stickers (public)' })
  @ApiResponse({
    status: 200,
    description: 'List of stickers retrieved successfully',
    type: [AssetResponseDto],
  })
  async getStickers() {
    return this.assetService.findByType(AssetType.STICKER);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get asset by ID (public)' })
  @ApiParam({
    name: 'id',
    description: 'Asset ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Asset retrieved successfully',
    type: AssetResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async findOne(@Param('id') id: string) {
    return this.assetService.findOne(id);
  }
}
