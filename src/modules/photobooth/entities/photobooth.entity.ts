import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PhotoboothStatus } from '../enums/session-status.enum';
import { Session } from './session.entity';

@Entity('photobooths')
export class Photobooth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: PhotoboothStatus,
    default: PhotoboothStatus.AVAILABLE,
  })
  status: PhotoboothStatus;

  @Column({ nullable: true })
  location?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  currentSessionId?: string;

  @OneToMany(() => Session, (session) => session.photobooth)
  sessions: Session[];

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
