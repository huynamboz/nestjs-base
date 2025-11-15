import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFilterPropertiesToAssets1763219661722 implements MigrationInterface {
  name = 'AddFilterPropertiesToAssets1763219661722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assets" ADD "filterType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "assets" ADD "scale" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "assets" ADD "offset_y" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "assets" ADD "anchor_idx" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "assets" ADD "left_idx" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "assets" ADD "right_idx" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "right_idx"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "left_idx"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "anchor_idx"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "offset_y"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "scale"`);
    await queryRunner.query(`ALTER TABLE "assets" DROP COLUMN "filterType"`);
  }
}
