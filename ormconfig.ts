import { DataSource } from 'typeorm';
import { User } from './src/modules/user/entities/user.entity';
import { Role } from './src/modules/auth/entities/role.entity';
import { Asset } from './src/modules/photo/entities/asset.entity';
import { Photobooth } from './src/modules/photobooth/entities/photobooth.entity';
import { Session } from './src/modules/photobooth/entities/session.entity';
import { Photo } from './src/modules/photobooth/entities/photo.entity';
import { BankInfo } from './src/modules/bank/entities/bank-info.entity';

const config = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'nestjs_user',
  password: process.env.DB_PASSWORD || 'nestjs_password',
  database: process.env.DB_NAME || 'nestjs_db',
  entities: [User, Role, Asset, Photobooth, Session, Photo, BankInfo],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Tắt synchronize khi dùng migrations
});

export default config;
