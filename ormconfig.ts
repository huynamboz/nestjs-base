import { DataSource } from 'typeorm';
import { User } from './src/modules/user/entities/user.entity';

const config = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'nestjs_user',
  password: process.env.DB_PASSWORD || 'nestjs_password',
  database: process.env.DB_NAME || 'nestjs_db',
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Tắt synchronize khi dùng migrations
});

export default config;
