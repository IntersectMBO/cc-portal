import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRoleAndPermissions1733147745970
  implements MigrationInterface
{
  name = 'UpdateRoleAndPermissions1733147745970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."permissions_code_enum" RENAME TO "permissions_code_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."permissions_code_enum" AS ENUM('manage_cc_members', 'add_constitution_version', 'manage_admins', 'manage_roles_and_permissions')`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ALTER COLUMN "code" TYPE "public"."permissions_code_enum" USING "code"::"text"::"public"."permissions_code_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."permissions_code_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."permissions_code_enum_old" AS ENUM('manage_cc_members', 'add_constitution_version', 'manage_admins')`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ALTER COLUMN "code" TYPE "public"."permissions_code_enum_old" USING "code"::"text"::"public"."permissions_code_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."permissions_code_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."permissions_code_enum_old" RENAME TO "permissions_code_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
