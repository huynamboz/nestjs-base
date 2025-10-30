import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { SessionStatus } from '../enums/session-status.enum';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class AdminSessionQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by session status',
    enum: SessionStatus,
    example: SessionStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(SessionStatus, { message: 'Status must be a valid session status' })
  status?: SessionStatus;

  @ApiPropertyOptional({
    description: 'Filter by photobooth ID',
    example: 'e3e0d016-f898-4baa-a283-853f56c70ba9',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Photobooth ID must be a valid UUID' })
  photoboothId?: string;

  @ApiPropertyOptional({
    description: 'Filter sessions from this date (ISO 8601 format)',
    example: '2025-10-28',
  })
  @IsOptional()
  @IsDateString({}, { message: 'DateFrom must be a valid ISO date string' })
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter sessions to this date (ISO 8601 format)',
    example: '2025-10-30',
  })
  @IsOptional()
  @IsDateString({}, { message: 'DateTo must be a valid ISO date string' })
  dateTo?: string;
}
