import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPointsToUsers1764161489000 implements MigrationInterface {
  name = 'AddPointsToUsers1764161489000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "points" integer NOT NULL DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "points"`);
  }
}

