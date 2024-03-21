import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedValues21710954190233 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `begin;
              -- Permissions
              insert into permissions ("id", "name", "created_at") values
              (uuid_generate_v4(), 'manage_cc_members', NOW()),
              (uuid_generate_v4(), 'add_constitution_version', NOW()),
              (uuid_generate_v4(), 'add_new_admin', NOW());
                  
              commit;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `begin;
              delete from role_permissions;
              delete from permissions;
      
              commit;`,
    );
  }
}
