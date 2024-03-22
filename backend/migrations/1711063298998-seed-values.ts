import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedValues1711063298998 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `begin;
              -- Roles
              insert into roles ("id", "code", "created_at") values
              (uuid_generate_v4(), 'super_admin', NOW()),
              (uuid_generate_v4(), 'admin', NOW()),
              (uuid_generate_v4(), 'user', NOW());
                  
              commit;`,
    );

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
              delete from user_roles;
              delete from roles;
      
              commit;`,
    );

    await queryRunner.query(
      `begin;
          delete from role_permissions;
          delete from permissions;
          
          commit;`,
    );
  }
}
