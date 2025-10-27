import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
  Matches,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @ApiPropertyOptional({
    description:
      'User password (minimum 8 characters, must contain uppercase, lowercase, number)',
    example: 'Password123',
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Role ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Role ID must be a valid UUID' })
  roleId?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiPropertyOptional({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name?: string;

  @ApiPropertyOptional({
    description:
      'User password (minimum 8 characters, must contain uppercase, lowercase, number)',
    example: 'Password123',
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Role ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Role ID must be a valid UUID' })
  roleId?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '0909090909',
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'User address',
    example: '123 Main St, City, Country',
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'User role information',
    type: 'object',
    properties: {
      id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      name: { type: 'string', example: 'user' },
      description: { type: 'string', example: 'Regular user' },
    },
  })
  role?: {
    id: string;
    name: string;
    description?: string;
  };

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '0909090909',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'User address',
  })
  address?: string;
}
