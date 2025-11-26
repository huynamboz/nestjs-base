import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BankInfo } from './entities/bank-info.entity';
import {
  CreateBankInfoDto,
  UpdateBankInfoDto,
  BanksResponseDto,
} from './dto/bank-info.dto';

@Injectable()
export class BankService {
  private readonly logger = new Logger(BankService.name);
  private readonly VIETQR_API_URL = 'https://api.vietqr.io/v2/banks';

  constructor(
    @InjectRepository(BankInfo)
    private readonly bankInfoRepository: Repository<BankInfo>,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Get list of banks from VietQR API
   */
  async getBanksList(): Promise<BanksResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<BanksResponseDto>(this.VIETQR_API_URL),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch banks list: ${error}`);
      throw new Error('Failed to fetch banks list from VietQR API');
    }
  }

  /**
   * Get current bank info (only one record should exist)
   */
  async getBankInfo(): Promise<BankInfo | null> {
    const bankInfo = await this.bankInfoRepository.find({
      take: 1,
      order: { createdAt: 'DESC' },
    });
    return bankInfo && bankInfo.length > 0 ? bankInfo[0] : null;
  }

  /**
   * Create or update bank info
   * Since there should only be one bank info, we update if exists, otherwise create
   */
  async createOrUpdateBankInfo(
    createBankInfoDto: CreateBankInfoDto,
  ): Promise<BankInfo> {
    const existing = await this.getBankInfo();

    if (existing) {
      // Update existing
      Object.assign(existing, createBankInfoDto);
      return this.bankInfoRepository.save(existing);
    } else {
      // Create new
      const bankInfo = this.bankInfoRepository.create(createBankInfoDto);
      return this.bankInfoRepository.save(bankInfo);
    }
  }

  /**
   * Update bank info
   */
  async updateBankInfo(
    id: string,
    updateBankInfoDto: UpdateBankInfoDto,
  ): Promise<BankInfo> {
    const bankInfo = await this.bankInfoRepository.findOne({
      where: { id },
    });

    if (!bankInfo) {
      throw new NotFoundException(`Bank info with ID ${id} not found`);
    }

    Object.assign(bankInfo, updateBankInfoDto);
    return this.bankInfoRepository.save(bankInfo);
  }

  /**
   * Delete bank info
   */
  async deleteBankInfo(id: string): Promise<{ message: string }> {
    const bankInfo = await this.bankInfoRepository.findOne({
      where: { id },
    });

    if (!bankInfo) {
      throw new NotFoundException(`Bank info with ID ${id} not found`);
    }

    await this.bankInfoRepository.remove(bankInfo);
    return { message: `Bank info with ID ${id} has been deleted` };
  }
}

