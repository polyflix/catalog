import {MigrationInterface, QueryRunner} from "typeorm";

export class password1654157804170 implements MigrationInterface {
    name = 'password1654157804170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "name" character varying NOT NULL, "password" character varying NOT NULL, "isRevoked" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP WITH TIME ZONE, "moduleId" uuid NOT NULL, CONSTRAINT "PK_cbeb55948781be9257f44febfa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "password" ADD CONSTRAINT "FK_5933a1ef9edf0874e210f1c64dd" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password" DROP CONSTRAINT "FK_5933a1ef9edf0874e210f1c64dd"`);
        await queryRunner.query(`DROP TABLE "password"`);
    }

}
