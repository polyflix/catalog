import { MigrationInterface, QueryRunner } from "typeorm";

export class createCatalogEntities1653901524617 implements MigrationInterface {
  name = "createCatalogEntities1653901524617";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "module_elements_element" ("moduleId" uuid NOT NULL, "elementId" uuid NOT NULL, "order" integer NOT NULL, CONSTRAINT "UQ_9238596e4eff2707d06cbb44210" UNIQUE ("moduleId", "order", "elementId"), CONSTRAINT "PK_18acd6e2c654e4c4a6353858633" PRIMARY KEY ("moduleId", "elementId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "label" text NOT NULL, "color" character varying(7) NOT NULL DEFAULT '#000000', "isReviewed" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_647c189a51deb35bc452751bc4a" UNIQUE ("label"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."element_visibility_enum" AS ENUM('public', 'protected', 'private')`
    );
    await queryRunner.query(
      `CREATE TABLE "element" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "visibility" "public"."element_visibility_enum" NOT NULL DEFAULT 'public', "draft" boolean NOT NULL DEFAULT false, "type" character varying NOT NULL, "name" character varying, "description" text, "slug" character varying, "thumbnail" character varying, "userId" uuid, CONSTRAINT "PK_6c5f203479270d39efaad8cd82b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cursus_visibility_enum" AS ENUM('public', 'protected', 'private')`
    );
    await queryRunner.query(
      `CREATE TABLE "cursus" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "visibility" "public"."cursus_visibility_enum" NOT NULL DEFAULT 'public', "draft" boolean NOT NULL DEFAULT false, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "UQ_133f31c2ec2bfcb6e499541c762" UNIQUE ("slug"), CONSTRAINT "PK_c716e690326af05b31edf511392" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_133f31c2ec2bfcb6e499541c76" ON "cursus" ("slug") `
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "avatar" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."module_visibility_enum" AS ENUM('public', 'protected', 'private')`
    );
    await queryRunner.query(
      `CREATE TABLE "module" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "visibility" "public"."module_visibility_enum" NOT NULL DEFAULT 'public', "draft" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "UQ_6f6b0fac734b5a498f8d4b75662" UNIQUE ("slug"), CONSTRAINT "PK_0e20d657f968b051e674fbe3117" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f6b0fac734b5a498f8d4b7566" ON "module" ("slug") `
    );
    await queryRunner.query(
      `CREATE TYPE "public"."course_visibility_enum" AS ENUM('public', 'protected', 'private')`
    );
    await queryRunner.query(
      `CREATE TABLE "course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "__v" integer NOT NULL DEFAULT '1', "visibility" "public"."course_visibility_enum" NOT NULL DEFAULT 'public', "draft" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text NOT NULL, "content" text, "userId" uuid NOT NULL, CONSTRAINT "UQ_a101f48e5045bcf501540a4a5b8" UNIQUE ("slug"), CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a101f48e5045bcf501540a4a5b" ON "course" ("slug") `
    );
    await queryRunner.query(
      `CREATE TABLE "element_tags_tag" ("elementId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_9405d71bc112309905c8479b13c" PRIMARY KEY ("elementId", "tagId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ad224561a78f7454420d5a3481" ON "element_tags_tag" ("elementId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_817d03b908ec39836eccf0857a" ON "element_tags_tag" ("tagId") `
    );
    await queryRunner.query(
      `CREATE TABLE "cursus_courses_course" ("cursusId" uuid NOT NULL, "courseId" uuid NOT NULL, CONSTRAINT "PK_6c6b744d0b573429e542f462f4b" PRIMARY KEY ("cursusId", "courseId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d8e26dec6d52683ab4b5f3c945" ON "cursus_courses_course" ("cursusId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_07203925fecdf16cbfc7b722b2" ON "cursus_courses_course" ("courseId") `
    );
    await queryRunner.query(
      `CREATE TABLE "course_modules_module" ("courseId" uuid NOT NULL, "moduleId" uuid NOT NULL, CONSTRAINT "PK_2645ad2412d10a95352a3896aaf" PRIMARY KEY ("courseId", "moduleId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_55ee6ebbe23a5ed8fbf8f3f25a" ON "course_modules_module" ("courseId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a3d8fafff28c4f254dc4621e8a" ON "course_modules_module" ("moduleId") `
    );
    await queryRunner.query(
      `ALTER TABLE "module_elements_element" ADD CONSTRAINT "FK_9c9237ea378d7b98ad2bdfa7a27" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "module_elements_element" ADD CONSTRAINT "FK_76ec8f119e06609c4464da81a45" FOREIGN KEY ("elementId") REFERENCES "element"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "element" ADD CONSTRAINT "FK_b3fb7acaf1aa2defb5b7a40df09" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "cursus" ADD CONSTRAINT "FK_803b54137d7666082dd0fdcb954" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "module" ADD CONSTRAINT "FK_a8e96aec78d849549b6c212d63b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "course" ADD CONSTRAINT "FK_bceb52bbd16679020822f6d6f5d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "element_tags_tag" ADD CONSTRAINT "FK_ad224561a78f7454420d5a3481b" FOREIGN KEY ("elementId") REFERENCES "element"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "element_tags_tag" ADD CONSTRAINT "FK_817d03b908ec39836eccf0857ac" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "cursus_courses_course" ADD CONSTRAINT "FK_d8e26dec6d52683ab4b5f3c945d" FOREIGN KEY ("cursusId") REFERENCES "cursus"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "cursus_courses_course" ADD CONSTRAINT "FK_07203925fecdf16cbfc7b722b22" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "course_modules_module" ADD CONSTRAINT "FK_55ee6ebbe23a5ed8fbf8f3f25a7" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "course_modules_module" ADD CONSTRAINT "FK_a3d8fafff28c4f254dc4621e8a2" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course_modules_module" DROP CONSTRAINT "FK_a3d8fafff28c4f254dc4621e8a2"`
    );
    await queryRunner.query(
      `ALTER TABLE "course_modules_module" DROP CONSTRAINT "FK_55ee6ebbe23a5ed8fbf8f3f25a7"`
    );
    await queryRunner.query(
      `ALTER TABLE "cursus_courses_course" DROP CONSTRAINT "FK_07203925fecdf16cbfc7b722b22"`
    );
    await queryRunner.query(
      `ALTER TABLE "cursus_courses_course" DROP CONSTRAINT "FK_d8e26dec6d52683ab4b5f3c945d"`
    );
    await queryRunner.query(
      `ALTER TABLE "element_tags_tag" DROP CONSTRAINT "FK_817d03b908ec39836eccf0857ac"`
    );
    await queryRunner.query(
      `ALTER TABLE "element_tags_tag" DROP CONSTRAINT "FK_ad224561a78f7454420d5a3481b"`
    );
    await queryRunner.query(
      `ALTER TABLE "course" DROP CONSTRAINT "FK_bceb52bbd16679020822f6d6f5d"`
    );
    await queryRunner.query(
      `ALTER TABLE "module" DROP CONSTRAINT "FK_a8e96aec78d849549b6c212d63b"`
    );
    await queryRunner.query(
      `ALTER TABLE "cursus" DROP CONSTRAINT "FK_803b54137d7666082dd0fdcb954"`
    );
    await queryRunner.query(
      `ALTER TABLE "element" DROP CONSTRAINT "FK_b3fb7acaf1aa2defb5b7a40df09"`
    );
    await queryRunner.query(
      `ALTER TABLE "module_elements_element" DROP CONSTRAINT "FK_76ec8f119e06609c4464da81a45"`
    );
    await queryRunner.query(
      `ALTER TABLE "module_elements_element" DROP CONSTRAINT "FK_9c9237ea378d7b98ad2bdfa7a27"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a3d8fafff28c4f254dc4621e8a"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_55ee6ebbe23a5ed8fbf8f3f25a"`
    );
    await queryRunner.query(`DROP TABLE "course_modules_module"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_07203925fecdf16cbfc7b722b2"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d8e26dec6d52683ab4b5f3c945"`
    );
    await queryRunner.query(`DROP TABLE "cursus_courses_course"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_817d03b908ec39836eccf0857a"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ad224561a78f7454420d5a3481"`
    );
    await queryRunner.query(`DROP TABLE "element_tags_tag"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a101f48e5045bcf501540a4a5b"`
    );
    await queryRunner.query(`DROP TABLE "course"`);
    await queryRunner.query(`DROP TYPE "public"."course_visibility_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f6b0fac734b5a498f8d4b7566"`
    );
    await queryRunner.query(`DROP TABLE "module"`);
    await queryRunner.query(`DROP TYPE "public"."module_visibility_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_133f31c2ec2bfcb6e499541c76"`
    );
    await queryRunner.query(`DROP TABLE "cursus"`);
    await queryRunner.query(`DROP TYPE "public"."cursus_visibility_enum"`);
    await queryRunner.query(`DROP TABLE "element"`);
    await queryRunner.query(`DROP TYPE "public"."element_visibility_enum"`);
    await queryRunner.query(`DROP TABLE "tag"`);
    await queryRunner.query(`DROP TABLE "module_elements_element"`);
  }
}
