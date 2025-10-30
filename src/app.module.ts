import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { PhotoModule } from './modules/photo/photo.module';
import { PhotoboothModule } from './modules/photobooth/photobooth.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    AuthModule,
    HealthModule,
    PhotoModule,
    PhotoboothModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
