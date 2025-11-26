import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('bank_info')
export class BankInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bankCode: string; // Code từ VietQR API (VD: VCB, BIDV, etc.)

  @Column()
  bankName: string; // Tên ngân hàng

  @Column()
  accountNumber: string; // Số tài khoản

  @Column()
  accountHolderName: string; // Tên chủ tài khoản

  @Column({ nullable: true })
  branch?: string; // Chi nhánh (optional)

  @Column({ nullable: true })
  qrCodeUrl?: string; // URL QR code (nếu có)

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

