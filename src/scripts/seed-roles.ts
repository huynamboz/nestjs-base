import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RoleService } from '../modules/auth/services/role.service';

async function seedRoles() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const roleService = app.get(RoleService);

  try {
    await roleService.seedRoles();
    console.log('✅ Roles seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
  } finally {
    await app.close();
  }
}

seedRoles();
