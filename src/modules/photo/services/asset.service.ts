import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset, AssetType } from '../entities/asset.entity';
import { CreateAssetDto } from '../dto/asset.dto';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(): Promise<Asset[]> {
    return this.assetRepository.find();
  }

  async findByType(type: AssetType): Promise<Asset[]> {
    return this.assetRepository.find({ where: { type } });
  }

  async findOne(id: string): Promise<Asset> {
    return this.assetRepository.findOne({ where: { id } });
  }

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = this.assetRepository.create(createAssetDto);
    return this.assetRepository.save(asset);
  }

  async uploadAsset(
    file: Express.Multer.File,
    type: AssetType,
  ): Promise<Asset> {
    const folder = `photoboth/${type}s`;
    const imageUrl = await this.cloudinaryService.uploadImage(file, folder);
    const publicId = this.cloudinaryService.extractPublicId(imageUrl);

    const asset = this.assetRepository.create({
      imageUrl,
      publicId,
      type,
    });

    return this.assetRepository.save(asset);
  }

  async remove(id: string): Promise<{ message: string }> {
    const asset = await this.findOne(id);

    if (asset && asset.publicId) {
      try {
        await this.cloudinaryService.deleteImage(asset.publicId);
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
      }
    }

    await this.assetRepository.delete(id);
    return { message: `Asset with ID ${id} has been deleted` };
  }
}
