import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export enum AssetType {
  FRAME = 'frame',
  FILTER = 'filter',
  STICKER = 'sticker',
}

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  publicId?: string;

  @Column({
    type: 'enum',
    enum: AssetType,
  })
  type: AssetType;

  @Column({ nullable: true })
  filterType?: string; // cute/cool/poetic

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  scale?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  offset_y?: number;

  @Column({ type: 'int', nullable: true })
  anchor_idx?: number;

  @Column({ type: 'int', nullable: true })
  left_idx?: number;

  @Column({ type: 'int', nullable: true })
  right_idx?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
