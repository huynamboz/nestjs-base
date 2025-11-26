import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto, AddPointsDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import {
  PaginationDto,
  PaginatedResponseDto,
} from '../../common/dto/pagination.dto';
import { PaginationService } from '../../common/services/pagination.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findAllPaginated(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<User>> {
    const searchFields = ['email', 'name', 'phone', 'address'];
    return this.paginationService.getPaginatedResults(
      this.userRepository,
      paginationDto,
      searchFields,
    );
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: `User with ID ${id} has been deleted` };
  }

  async addPoints(id: string, addPointsDto: AddPointsDto): Promise<User> {
    const user = await this.findOne(id);
    user.points = (user.points || 0) + addPointsDto.points;
    return this.userRepository.save(user);
  }

  /**
   * Deduct points from user
   * @param id User ID
   * @param points Points to deduct
   * @returns Updated user
   * @throws BadRequestException if user doesn't have enough points
   */
  async deductPoints(id: string, points: number): Promise<User> {
    const user = await this.findOne(id);
    const currentPoints = user.points || 0;
    
    if (currentPoints < points) {
      throw new BadRequestException(
        `Insufficient points. Required: ${points}, Available: ${currentPoints}`,
      );
    }
    
    user.points = currentPoints - points;
    return this.userRepository.save(user);
  }

  /**
   * Generate a unique payment code (6-8 characters, alphanumeric lowercase)
   */
  private generatePaymentCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Generate and assign a unique payment code to user
   */
  async generateUniquePaymentCode(userId: string): Promise<string> {
    let code: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      code = this.generatePaymentCode();
      const existing = await this.userRepository.findOne({
        where: { paymentCode: code },
      });
      if (!existing) {
        break;
      }
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      throw new Error('Failed to generate unique payment code');
    }

    const user = await this.findOne(userId);
    user.paymentCode = code;
    await this.userRepository.save(user);

    return code;
  }

  /**
   * Find user by payment code
   */
  async findByPaymentCode(paymentCode: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { paymentCode },
    });
    if (!user) {
      throw new NotFoundException(
        `User with payment code ${paymentCode} not found`,
      );
    }
    return user;
  }

  /**
   * Auto-generate payment code when creating user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    // Generate payment code after user is created
    await this.generateUniquePaymentCode(savedUser.id);

    // Return user with payment code
    return this.findOne(savedUser.id);
  }
}
