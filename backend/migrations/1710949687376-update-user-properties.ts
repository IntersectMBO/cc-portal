import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserProperties1710949687376 implements MigrationInterface {
  name = "UpdateUserProperties1710949687376";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."permissions_name_enum" AS ENUM('manage_cc_members', 'add_constitution_version', 'add_new_admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."permissions_name_enum" NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permissions" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "hot_adress" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "profile_photo" character varying`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."roles_code_enum" RENAME TO "roles_code_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."roles_code_enum" AS ENUM('super_admin', 'admin', 'user')`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "code" TYPE "public"."roles_code_enum" USING "code"::"text"::"public"."roles_code_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."roles_code_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."roles_code_enum_old" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ALTER COLUMN "code" TYPE "public"."roles_code_enum_old" USING "code"::"text"::"public"."roles_code_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."roles_code_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."roles_code_enum_old" RENAME TO "roles_code_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_photo"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "hot_adress"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"`,
    );
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TYPE "public"."permissions_name_enum"`);
  }
}
