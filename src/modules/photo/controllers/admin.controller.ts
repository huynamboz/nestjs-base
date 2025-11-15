import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
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
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { AssetService } from '../services/asset.service';
import { CreateAssetDto, AssetResponseDto } from '../dto/asset.dto';
import { AssetType } from '../entities/asset.entity';
import {
  PaginationDto,
  PaginatedResponseDto,
} from '../../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RoleName } from '../../auth/entities/role.entity';

@ApiTags('admin-assets')
@Controller('api/v1/admin/assets')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Get all assets with pagination (Admin only)' })
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
  @ApiResponse({
    status: 200,
    description: 'Paginated list of all assets retrieved successfully',
    type: PaginatedResponseDto<AssetResponseDto>,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.assetService.findAllPaginated(paginationDto);
  }

  @Post('upload')
  @Roles(RoleName.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload new asset file (Admin only)' })
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
        type: {
          type: 'string',
          enum: ['frame', 'filter', 'sticker'],
          description: 'Asset type',
          example: 'frame',
        },
        filterType: {
          type: 'string',
          enum: ['cute', 'cool', 'poetic'],
          description: 'Filter type (only for filter type)',
          example: 'cool',
        },
        scale: {
          type: 'number',
          description: 'Scale value',
          example: 2.5,
        },
        offset_y: {
          type: 'number',
          description: 'Offset Y value',
          example: -100,
        },
        anchor_idx: {
          type: 'number',
          description: 'Anchor index',
          example: 10,
        },
        left_idx: {
          type: 'number',
          description: 'Left index',
          example: 10,
        },
        right_idx: {
          type: 'number',
          description: 'Right index',
          example: 10,
        },
      },
      required: ['file', 'type'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Asset uploaded successfully',
    type: AssetResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({
            fileType: /^image\/(jpeg|jpg|png|gif|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('type') type: AssetType,
    @Body('filterType') filterType?: string,
    @Body('scale') scale?: number,
    @Body('offset_y') offset_y?: number,
    @Body('anchor_idx') anchor_idx?: number,
    @Body('left_idx') left_idx?: number,
    @Body('right_idx') right_idx?: number,
  ) {
    const additionalData: any = {};
    if (filterType) additionalData.filterType = filterType;
    if (scale !== undefined) additionalData.scale = Number(scale);
    if (offset_y !== undefined) additionalData.offset_y = Number(offset_y);
    if (anchor_idx !== undefined) additionalData.anchor_idx = Number(anchor_idx);
    if (left_idx !== undefined) additionalData.left_idx = Number(left_idx);
    if (right_idx !== undefined) additionalData.right_idx = Number(right_idx);
    
    return this.assetService.uploadAsset(file, type, Object.keys(additionalData).length > 0 ? additionalData : undefined);
  }

  @Post()
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Create asset with URL (Admin only)' })
  @ApiBody({ type: CreateAssetDto })
  @ApiResponse({
    status: 201,
    description: 'Asset created successfully',
    type: AssetResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetService.create(createAssetDto);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Delete asset (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Asset ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Asset deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Asset with ID 123e4567-e89b-12d3-a456-426614174000 has been deleted',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async remove(@Param('id') id: string) {
    return this.assetService.remove(id);
  }
}
