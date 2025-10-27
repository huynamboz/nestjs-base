import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RoleService } from '../modules/auth/services/role.service';
import { UserService } from '../modules/user/user.service';
import { PasswordService } from '../modules/auth/services/password.service';
import { RoleName } from '../modules/auth/entities/role.entity';

async function seedAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const roleService = app.get(RoleService);
    const userService = app.get(UserService);
    const passwordService = app.get(PasswordService);

    console.log('🌱 Starting admin seeding process...');

    // 1. Seed roles first
    console.log('📋 Seeding roles...');
    await roleService.seedRoles();
    console.log('✅ Roles seeded successfully');

    // 2. Check if admin already exists
    const existingUsers = await userService.findAll();
    const adminExists = existingUsers.find(user => 
      user.role?.name === RoleName.ADMIN
    );

    if (adminExists) {
      console.log('⚠️  Admin account already exists:', adminExists.email);
      return;
    }

    // 3. Get admin role
    const adminRole = await roleService.findByName(RoleName.ADMIN);
    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    // 4. Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await passwordService.hashPassword('Admin123!');
    
    const adminUser = await userService.create({
      email: 'admin@photoboth.com',
      name: 'System Administrator',
      password: hashedPassword,
      roleId: adminRole.id,
    });

    console.log('🎉 Admin account created successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password: Admin123!');
    console.log('🆔 User ID:', adminUser.id);
    console.log('👑 Role:', adminUser.role?.name);

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } finally {
    await app.close();
  }
}

seedAdmin();
