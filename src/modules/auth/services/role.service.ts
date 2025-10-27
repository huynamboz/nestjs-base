import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleName } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findByName(name: RoleName): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { name } });
  }

  async findById(id: string): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { id } });
  }

  async create(name: RoleName, description?: string): Promise<Role> {
    const role = this.roleRepository.create({ name, description });
    return this.roleRepository.save(role);
  }

  async seedRoles(): Promise<void> {
    const existingRoles = await this.findAll();
    
    if (existingRoles.length === 0) {
      await this.create(RoleName.ADMIN, 'Administrator with full access');
      await this.create(RoleName.USER, 'Regular user with limited access');
      console.log('✅ Roles seeded successfully');
    }
  }
}
