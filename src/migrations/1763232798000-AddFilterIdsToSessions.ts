import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFilterIdsToSessions1763232798000 implements MigrationInterface {
  name = 'AddFilterIdsToSessions1763232798000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD "filterIds" text array DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "filterIds"`);
  }
}

