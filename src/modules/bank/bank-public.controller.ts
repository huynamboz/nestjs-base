import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { BankService } from './bank.service';
import { BankInfoResponseDto } from './dto/bank-info.dto';

@ApiTags('bank')
@Controller('api/v1/bank-info')
export class BankPublicController {
  constructor(private readonly bankService: BankService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get bank information for payment',
    description: 'Public endpoint to get bank account information for users to make deposits. No authentication required.'
  })
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
  async getBankInfo() {
    const bankInfo = await this.bankService.getBankInfo();
    if (!bankInfo) {
      return null;
    }
    return bankInfo;
  }
}

