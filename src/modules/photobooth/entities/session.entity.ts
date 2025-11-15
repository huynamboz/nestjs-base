import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SessionStatus } from '../enums/session-status.enum';
import { Photobooth } from './photobooth.entity';
import { Photo } from './photo.entity';
import { User } from '../../user/entities/user.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.PENDING,
  })
  status: SessionStatus;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column()
  photoboothId: string;

  @ManyToOne(() => Photobooth, (photobooth) => photobooth.sessions)
  @JoinColumn({ name: 'photoboothId' })
  photobooth: Photobooth;

  @OneToMany(() => Photo, (photo) => photo.session)
  photos: Photo[];

  @Column({ nullable: true })
  startedAt?: Date;

  @Column({ nullable: true })
  completedAt?: Date;

  @Column({ nullable: true })
  expiresAt?: Date;

  @Column({ default: 0 })
  photoCount: number;

  @Column({ default: 5 })
  maxPhotos: number;

  @Column({ nullable: true })
  notes?: string;

  @Column('text', { array: true, nullable: true, default: [] })
  filterIds?: string[];

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
