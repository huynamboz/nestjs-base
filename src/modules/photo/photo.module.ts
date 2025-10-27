import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AssetService } from './services/asset.service';
import { CloudinaryService } from './services/cloudinary.service';
import { PublicController } from './controllers/public.controller';
import { AdminController } from './controllers/admin.controller';
import { Asset } from './entities/asset.entity';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Asset]), ConfigModule],
  controllers: [PublicController, AdminController],
  providers: [AssetService, CloudinaryService, PaginationService],
  exports: [AssetService],
})
export class PhotoModule {}
