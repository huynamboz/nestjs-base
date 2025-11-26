import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBankInfoTable1764165261000 implements MigrationInterface {
  name = 'CreateBankInfoTable1764165261000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "bank_info" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bankCode" character varying NOT NULL,
        "bankName" character varying NOT NULL,
        "accountNumber" character varying NOT NULL,
        "accountHolderName" character varying NOT NULL,
        "branch" character varying,
        "qrCodeUrl" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bank_info" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bank_info"`);
  }
}

