import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveFilterIdFromSessions1763234305000 implements MigrationInterface {
  name = 'RemoveFilterIdFromSessions1763234305000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "filterId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD "filterId" character varying`,
    );
  }
}

