import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedValues1713777510072 implements MigrationInterface {
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
                  insert into permissions ("id", "code", "created_at") values
                  (uuid_generate_v4(), 'manage_cc_members', NOW()),
                  (uuid_generate_v4(), 'add_constitution_version', NOW()),
                  (uuid_generate_v4(), 'add_new_admin', NOW()),
                  (uuid_generate_v4(), 'manage_permissions', NOW());
                  
                  commit;`,
    );

    await queryRunner.query(
      `BEGIN;
            INSERT INTO role_permissions (role_id, permission_id)
            SELECT roles.id, permissions.id
            FROM roles
            INNER JOIN permissions ON permissions.code IN ('manage_cc_members', 'add_constitution_version', 'add_new_admin', 'manage_permissions')
            WHERE (roles.code = 'super_admin')
            OR (roles.code = 'admin' AND permissions.code IN ('manage_cc_members', 'add_constitution_version'))
            ;
            COMMIT;`,
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
