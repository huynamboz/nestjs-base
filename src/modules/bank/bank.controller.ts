import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleName } from '../auth/entities/role.entity';
import { BankService } from './bank.service';
import {
  CreateBankInfoDto,
  UpdateBankInfoDto,
  BankInfoResponseDto,
  BanksResponseDto,
} from './dto/bank-info.dto';

@ApiTags('admin-bank')
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN)
@ApiBearerAuth('JWT-auth')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get('banks')
  @ApiOperation({ summary: 'Get list of banks from VietQR API (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of banks retrieved successfully',
    type: BanksResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getBanksList() {
    return this.bankService.getBanksList();
  }

  @Get('bank-info')
  @ApiOperation({ summary: 'Get current bank information (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Bank information retrieved successfully',
    type: BankInfoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Bank information not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Bank information not found' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getBankInfo() {
    const bankInfo = await this.bankService.getBankInfo();
    if (!bankInfo) {
      return null;
    }
    return bankInfo;
  }

  @Post('bank-info')
  @ApiOperation({
    summary: 'Create or update bank information (Admin only)',
    description:
      'Creates new bank info if none exists, otherwise updates existing one',
  })
  @ApiBody({ type: CreateBankInfoDto })
  @ApiResponse({
    status: 200,
    description: 'Bank information created/updated successfully',
    type: BankInfoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async createOrUpdateBankInfo(@Body() createBankInfoDto: CreateBankInfoDto) {
    return this.bankService.createOrUpdateBankInfo(createBankInfoDto);
  }

  @Put('bank-info/:id')
  @ApiOperation({ summary: 'Update bank information by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Bank info ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateBankInfoDto })
  @ApiResponse({
    status: 200,
    description: 'Bank information updated successfully',
    type: BankInfoResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Bank information not found' })
  async updateBankInfo(
    @Param('id') id: string,
    @Body() updateBankInfoDto: UpdateBankInfoDto,
  ) {
    return this.bankService.updateBankInfo(id, updateBankInfoDto);
  }

  @Delete('bank-info/:id')
  @ApiOperation({ summary: 'Delete bank information by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Bank info ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Bank information deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Bank info with ID 123e4567-e89b-12d3-a456-426614174000 has been deleted',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Bank information not found' })
  async deleteBankInfo(@Param('id') id: string) {
    return this.bankService.deleteBankInfo(id);
  }
}

