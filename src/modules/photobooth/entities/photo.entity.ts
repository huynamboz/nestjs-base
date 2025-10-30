import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Session } from './session.entity';

@Entity('photos')
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sessionId: string;

  @ManyToOne(() => Session, (session) => session.photos)
  @JoinColumn({ name: 'sessionId' })
  session: Session;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  publicId?: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ default: 1 })
  order: number;

  @Column({ nullable: true })
  caption?: string;

  @Column({ default: false })
  isProcessed: boolean;

  @Column({ nullable: true })
  processedAt?: Date;

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
