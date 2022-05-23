import { MigrationInterface, QueryRunner } from "typeorm";

export class removeUniqueCursusTitle1653656855703
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE cursus DROP CONSTRAINT IF EXISTS "UQ_09c41f12889e769c365cb0484c0";`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE cursus ADD CONSTRAINT "UQ_09c41f12889e769c365cb0484c0" UNIQUE ("title");`
    );
  }
}
