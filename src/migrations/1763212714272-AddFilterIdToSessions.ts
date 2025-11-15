import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFilterIdToSessions1763212714272 implements MigrationInterface {
  name = 'AddFilterIdToSessions1763212714272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD "filterId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "filterId"`);
  }
}
