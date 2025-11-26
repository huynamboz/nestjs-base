import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateBankInfoDto {
  @ApiProperty({
    description: 'Bank code from VietQR API',
    example: 'VCB',
  })
  @IsString({ message: 'Bank code must be a string' })
  @IsNotEmpty({ message: 'Bank code is required' })
  bankCode: string;

  @ApiProperty({
    description: 'Bank name',
    example: 'Ngân hàng TMCP Ngoại Thương Việt Nam',
  })
  @IsString({ message: 'Bank name must be a string' })
  @IsNotEmpty({ message: 'Bank name is required' })
  bankName: string;

  @ApiProperty({
    description: 'Account number',
    example: '0123456789',
  })
  @IsString({ message: 'Account number must be a string' })
  @IsNotEmpty({ message: 'Account number is required' })
  @MinLength(8, { message: 'Account number must be at least 8 characters' })
  accountNumber: string;

  @ApiProperty({
    description: 'Account holder name',
    example: 'NGUYEN VAN A',
  })
  @IsString({ message: 'Account holder name must be a string' })
  @IsNotEmpty({ message: 'Account holder name is required' })
  @MinLength(2, { message: 'Account holder name must be at least 2 characters' })
  accountHolderName: string;

  @ApiPropertyOptional({
    description: 'Bank branch',
    example: 'Chi nhánh Hà Nội',
  })
  @IsOptional()
  @IsString({ message: 'Branch must be a string' })
  branch?: string;

  @ApiPropertyOptional({
    description: 'QR code URL',
    example: 'https://api.vietqr.io/image/...',
  })
  @IsOptional()
  @IsString({ message: 'QR code URL must be a string' })
  qrCodeUrl?: string;
}

export class UpdateBankInfoDto {
  @ApiPropertyOptional({
    description: 'Bank code from VietQR API',
    example: 'VCB',
  })
  @IsOptional()
  @IsString({ message: 'Bank code must be a string' })
  bankCode?: string;

  @ApiPropertyOptional({
    description: 'Bank name',
    example: 'Ngân hàng TMCP Ngoại Thương Việt Nam',
  })
  @IsOptional()
  @IsString({ message: 'Bank name must be a string' })
  bankName?: string;

  @ApiPropertyOptional({
    description: 'Account number',
    example: '0123456789',
  })
  @IsOptional()
  @IsString({ message: 'Account number must be a string' })
  @MinLength(8, { message: 'Account number must be at least 8 characters' })
  accountNumber?: string;

  @ApiPropertyOptional({
    description: 'Account holder name',
    example: 'NGUYEN VAN A',
  })
  @IsOptional()
  @IsString({ message: 'Account holder name must be a string' })
  @MinLength(2, { message: 'Account holder name must be at least 2 characters' })
  accountHolderName?: string;

  @ApiPropertyOptional({
    description: 'Bank branch',
    example: 'Chi nhánh Hà Nội',
  })
  @IsOptional()
  @IsString({ message: 'Branch must be a string' })
  branch?: string;

  @ApiPropertyOptional({
    description: 'QR code URL',
    example: 'https://api.vietqr.io/image/...',
  })
  @IsOptional()
  @IsString({ message: 'QR code URL must be a string' })
  qrCodeUrl?: string;
}

export class BankInfoResponseDto {
  @ApiProperty({
    description: 'Bank info ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Bank code from VietQR API',
    example: 'VCB',
  })
  bankCode: string;

  @ApiProperty({
    description: 'Bank name',
    example: 'Ngân hàng TMCP Ngoại Thương Việt Nam',
  })
  bankName: string;

  @ApiProperty({
    description: 'Account number',
    example: '0123456789',
  })
  accountNumber: string;

  @ApiProperty({
    description: 'Account holder name',
    example: 'NGUYEN VAN A',
  })
  accountHolderName: string;

  @ApiPropertyOptional({
    description: 'Bank branch',
    example: 'Chi nhánh Hà Nội',
  })
  branch?: string;

  @ApiPropertyOptional({
    description: 'QR code URL',
    example: 'https://api.vietqr.io/image/...',
  })
  qrCodeUrl?: string;

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

export class BankDto {
  @ApiProperty({ example: 43 })
  id: number;

  @ApiProperty({ example: 'Ngân hàng TMCP Ngoại Thương Việt Nam' })
  name: string;

  @ApiProperty({ example: 'VCB' })
  code: string;

  @ApiProperty({ example: '970436' })
  bin: string;

  @ApiProperty({ example: 'Vietcombank' })
  shortName: string;

  @ApiProperty({ example: 'https://cdn.vietqr.io/img/VCB.png' })
  logo: string;

  @ApiProperty({ example: 1 })
  transferSupported: number;

  @ApiProperty({ example: 1 })
  lookupSupported: number;
}

export class BanksResponseDto {
  @ApiProperty({ example: '00' })
  code: string;

  @ApiProperty({ example: 'Get Bank list successful! Total 65 banks' })
  desc: string;

  @ApiProperty({ type: [BankDto] })
  data: BankDto[];
}

