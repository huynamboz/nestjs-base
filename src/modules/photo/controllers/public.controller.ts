import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AssetService } from '../services/asset.service';
import { AssetResponseDto, AssetQueryDto } from '../dto/asset.dto';
import { AssetType } from '../entities/asset.entity';
import {
  PaginationDto,
  PaginatedResponseDto,
} from '../../../common/dto/pagination.dto';

@ApiTags('public-assets')
@Controller('api/v1/assets')
export class PublicController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  @ApiOperation({ summary: 'Get all assets with pagination (public)' })
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
    description: 'Search term for filtering assets',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: AssetType,
    description: 'Filter by asset type (frame, filter, sticker)',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of all assets retrieved successfully',
    type: PaginatedResponseDto<AssetResponseDto>,
  })
  async findAll(@Query() queryDto: AssetQueryDto) {
    return this.assetService.findAllPaginated(queryDto);
  }

  @Get('frames')
  @ApiOperation({ summary: 'Get all frames with pagination (public)' })
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
    description: 'Search term for filtering frames',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of frames retrieved successfully',
    type: PaginatedResponseDto<AssetResponseDto>,
  })
  async getFrames(@Query() paginationDto: PaginationDto) {
    return this.assetService.findByTypePaginated(
      AssetType.FRAME,
      paginationDto,
    );
  }

  @Get('filters')
  @ApiOperation({ summary: 'Get all filters with pagination (public)' })
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
    description: 'Search term for filtering filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of filters retrieved successfully',
    type: PaginatedResponseDto<AssetResponseDto>,
  })
  async getFilters(@Query() paginationDto: PaginationDto) {
    return this.assetService.findByTypePaginated(
      AssetType.FILTER,
      paginationDto,
    );
  }

  @Get('stickers')
  @ApiOperation({ summary: 'Get all stickers with pagination (public)' })
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
    description: 'Search term for filtering stickers',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of stickers retrieved successfully',
    type: PaginatedResponseDto<AssetResponseDto>,
  })
  async getStickers(@Query() paginationDto: PaginationDto) {
    return this.assetService.findByTypePaginated(
      AssetType.STICKER,
      paginationDto,
    );
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
