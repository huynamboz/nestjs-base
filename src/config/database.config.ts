import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/user/entities/user.entity';
import { Role } from '../modules/auth/entities/role.entity';
import { Asset } from '../modules/photo/entities/asset.entity';
import { Photobooth } from '../modules/photobooth/entities/photobooth.entity';
import { Session } from '../modules/photobooth/entities/session.entity';
import { Photo } from '../modules/photobooth/entities/photo.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'nestjs_user',
  password: process.env.DB_PASSWORD || 'nestjs_password',
  database: process.env.DB_NAME || 'nestjs_db',
  entities: [User, Role, Asset, Photobooth, Session, Photo],
  synchronize: true, // Tạm thời bật synchronize để test
  logging: process.env.NODE_ENV === 'development',
  // migrations: ['src/migrations/*.ts'],
  // migrationsRun: process.env.NODE_ENV === 'production',
};
