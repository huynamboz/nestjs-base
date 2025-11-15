import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoboothService } from './services/photobooth.service';
import { SessionService } from './services/session.service';
import { PhotoService } from './services/photo.service';
import { PublicController } from './controllers/public.controller';
import { AdminController } from './controllers/admin.controller';
import { PhotoboothGateway } from './gateways/photobooth.gateway';
import { Photobooth } from './entities/photobooth.entity';
import { Session } from './entities/session.entity';
import { Photo } from './entities/photo.entity';
import { PaginationService } from '../../common/services/pagination.service';
import { CloudinaryService } from '../photo/services/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Photobooth, Session, Photo])],
  controllers: [PublicController, AdminController],
  providers: [
    PhotoboothService,
    SessionService,
    PhotoService,
    PaginationService,
    CloudinaryService,
    PhotoboothGateway,
  ],
  exports: [PhotoboothService, SessionService, PhotoService],
})
export class PhotoboothModule {}
