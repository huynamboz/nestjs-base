import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { RoleName } from './entities/role.entity';
import { RoleService } from './services/role.service';
import { UserService } from '../user/user.service';

@ApiTags('admin')
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Get('roles')
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Get all roles (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of roles retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getRoles() {
    return this.roleService.findAll();
  }

  @Post('users/:id/role')
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Assign role to user (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'User ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roleId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Role assigned successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async assignRole(
    @Param('id') userId: string,
    @Body('roleId') roleId: string,
  ) {
    const role = await this.roleService.findById(roleId);

    if (!role) {
      throw new Error('Role not found');
    }

    return this.userService.update(userId, { roleId });
  }

  @Get('seed-roles')
  @Roles(RoleName.ADMIN)
  @ApiOperation({ summary: 'Seed default roles (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Roles seeded successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async seedRoles() {
    await this.roleService.seedRoles();
    return { message: 'Roles seeded successfully' };
  }
}
