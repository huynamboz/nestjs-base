import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSessionsUserId1761575267000 implements MigrationInterface {
  name = 'FixSessionsUserId1761575267000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, delete all sessions with null userId
    await queryRunner.query(`DELETE FROM sessions WHERE "userId" IS NULL`);
    
    // Then alter the column to be NOT NULL
    await queryRunner.query(`ALTER TABLE sessions ALTER COLUMN "userId" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert: make userId nullable again
    await queryRunner.query(`ALTER TABLE sessions ALTER COLUMN "userId" DROP NOT NULL`);
  }
}
