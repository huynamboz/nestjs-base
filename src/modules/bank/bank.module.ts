import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { BankController } from './bank.controller';
import { BankPublicController } from './bank-public.controller';
import { BankService } from './bank.service';
import { BankInfo } from './entities/bank-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankInfo]), HttpModule],
  controllers: [BankController, BankPublicController],
  providers: [BankService],
  exports: [BankService],
})
export class BankModule {}

