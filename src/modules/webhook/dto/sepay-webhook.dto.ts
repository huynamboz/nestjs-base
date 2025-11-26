import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsIn } from 'class-validator';

export class SepayWebhookDto {
  @ApiProperty({
    description: 'ID giao dịch trên SePay',
    example: 92704,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Brand name của ngân hàng',
    example: 'Vietcombank',
  })
  @IsString()
  gateway: string;

  @ApiProperty({
    description: 'Thời gian xảy ra giao dịch phía ngân hàng',
    example: '2023-03-25 14:02:37',
  })
  @IsString()
  transactionDate: string;

  @ApiProperty({
    description: 'Số tài khoản ngân hàng',
    example: '0123499999',
  })
  @IsString()
  accountNumber: string;

  @ApiPropertyOptional({
    description: 'Mã code thanh toán (có thể chứa user ID)',
    example: 'user-uuid-here',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  code?: string | null;

  @ApiProperty({
    description: 'Nội dung chuyển khoản',
    example: 'chuyen tien mua iphone',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Loại giao dịch. in là tiền vào, out là tiền ra',
    example: 'in',
    enum: ['in', 'out'],
  })
  @IsIn(['in', 'out'])
  transferType: 'in' | 'out';

  @ApiProperty({
    description: 'Số tiền giao dịch',
    example: 2277000,
  })
  @IsNumber()
  transferAmount: number;

  @ApiProperty({
    description: 'Số dư tài khoản (lũy kế)',
    example: 19077000,
  })
  @IsNumber()
  accumulated: number;

  @ApiPropertyOptional({
    description: 'Tài khoản ngân hàng phụ',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  subAccount?: string | null;

  @ApiProperty({
    description: 'Mã tham chiếu của tin nhắn sms',
    example: 'MBVCB.3278907687',
  })
  @IsString()
  referenceCode: string;

  @ApiPropertyOptional({
    description: 'Toàn bộ nội dung tin nhắn sms',
    example: '',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

