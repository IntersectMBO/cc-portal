import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddManagePermissions1733148028374 implements MigrationInterface {
  name = 'AddManagePermissions1733148028374';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        -- Add permission 'manage_roles_and_permissions'
        INSERT INTO permissions ("id", "code", "created_at") VALUES
        (uuid_generate_v4(), 'manage_roles_and_permissions', NOW());
    `);

    await queryRunner.query(`
        -- Add permission 'manage_roles_and_permissions' to the super_admin role
        INSERT INTO role_permissions(role_id, permission_id)
        SELECT roles.id, permissions.id
        FROM roles
        INNER JOIN permissions ON permissions.code = 'manage_roles_and_permissions'
        WHERE roles.code = 'super_admin';
    `);

    await queryRunner.query(`
        -- Add permission 'manage_roles_and_permissions' to registered super_admin
        INSERT INTO user_permissions(user_id, permission_id)
        SELECT users.id, permissions.id
        FROM permissions
        INNER join users on users.role_id = (SELECT id from roles where code = 'super_admin')
        WHERE permissions.code = 'manage_roles_and_permissions';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        -- Remove permission 'manage_roles_and_permissions' from registered super_admin
        DELETE FROM user_permissions
        WHERE permission_id = (SELECT id FROM permissions WHERE code = 'manage_roles_and_permissions');
    `);

    await queryRunner.query(`
        -- Remove permission 'manage_roles_and_permissions' from the super_admin role
        DELETE FROM role_permissions
        WHERE permission_id = (SELECT id FROM permissions WHERE code = 'manage_roles_and_permissions');
    `);

    await queryRunner.query(`
        -- Remove permission 'manage_roles_and_permissions'
        DELETE FROM permissions WHERE code = 'manage_roles_and_permissions';
    `);
  }
}
