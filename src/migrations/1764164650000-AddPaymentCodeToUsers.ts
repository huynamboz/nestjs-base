import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentCodeToUsers1764164650000 implements MigrationInterface {
  name = 'AddPaymentCodeToUsers1764164650000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if paymentCode column already exists
    const table = await queryRunner.getTable('users');
    const paymentCodeColumn = table?.findColumnByName('paymentCode');

    // Add paymentCode column only if it doesn't exist
    if (!paymentCodeColumn) {
      await queryRunner.query(`ALTER TABLE "users" ADD "paymentCode" character varying(8)`);
    }
    
    // Check if index already exists
    const hasIndex = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'users' 
        AND indexname = 'IDX_users_paymentCode'
      )
    `);

    // Create unique index only if it doesn't exist
    if (!hasIndex[0].exists) {
      await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_paymentCode" ON "users" ("paymentCode") WHERE "paymentCode" IS NOT NULL`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Check if index exists before dropping
    const hasIndex = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'users' 
        AND indexname = 'IDX_users_paymentCode'
      )
    `);

    if (hasIndex[0].exists) {
      await queryRunner.query(`DROP INDEX "IDX_users_paymentCode"`);
    }

    // Check if column exists before dropping
    const table = await queryRunner.getTable('users');
    const paymentCodeColumn = table?.findColumnByName('paymentCode');

    if (paymentCodeColumn) {
      await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "paymentCode"`);
    }
  }
}

