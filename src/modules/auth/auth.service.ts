import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { User } from '../user/entities/user.entity';
import { PasswordService } from './services/password.service';
import { RoleService } from './services/role.service';
import { RoleName } from './entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly roleService: RoleService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Kiểm tra email đã tồn tại chưa
    const existingUsers = await this.userService.findAll();
    const userExists = existingUsers.find(
      (user: User) => user.email === registerDto.email,
    );

    if (userExists) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await this.passwordService.hashPassword(
      registerDto.password,
    );

    // Lấy role USER mặc định
    const userRole = await this.roleService.findByName(RoleName.USER);

    // Tạo user mới với password đã hash và role
    const newUser = await this.userService.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      roleId: userRole?.id,
    });

    // Tạo JWT token
    const token = this.generateToken(newUser.id);

    return {
      message: 'User registered successfully',
      access_token: token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Tìm user theo email
    const users = await this.userService.findAll();
    const user = users.find((u: User) => u.email === loginDto.email);

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    // Kiểm tra password
    const isPasswordValid = await this.passwordService.comparePassword(
      loginDto.password,
      user.password || '',
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    // Tạo JWT token
    const token = this.generateToken(user.id);

    return {
      message: 'Login successful',
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  logout() {
    return {
      message: 'Logout successful',
    };
  }

  private generateToken(userId: string): string {
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      iss: process.env.JWT_ISSUER || 'nestjs-app',
    };
    return this.jwtService.sign(payload);
  }
}
