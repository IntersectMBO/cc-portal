import { MigrationInterface, QueryRunner } from 'typeorm';

export class TestData1717518991112 implements MigrationInterface {
  name = 'TestData1717518991112';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminEmail = 'adminemail@qweqweqq.com';
    const standardUserEmail1 = 'stuser1@qweqweqq.com';
    const standardUserEmail2 = 'stuser2@qweqweqq.com';
    const standardUserEmail3 = 'stuser3@qweqweqq.com';

    await queryRunner.query('begin;');

    //Insert USERS
    await queryRunner.query(
      `-- Users
            insert into users ("id", "name", "email", "description", "status", role_id, "created_at") values
            (uuid_generate_v4(), 'Admin User', '${adminEmail}', 'I am a super admin', 'active', (select id from roles where code = 'super_admin'), NOW()),
            (uuid_generate_v4(), 'Standard User 1', '${standardUserEmail1}', 'I am a standard user 1', 'active', (select id from roles where code = 'user'), NOW()),
            (uuid_generate_v4(), 'Standard User 2', '${standardUserEmail2}', 'I am a standard user 2', 'active', (select id from roles where code = 'user'), NOW()),
            (uuid_generate_v4(), 'Standard User 3', '${standardUserEmail3}', 'I am a standard user 3', 'active', (select id from roles where code = 'user'), NOW())`,
    );

    //Insert USER_PERMISSIONS
    await queryRunner.query(
      `-- User Permissions
        insert into user_permissions ("user_id", "permission_id") values
        ((select id from users where email = '${adminEmail}'), (select id from permissions where code = 'add_new_admin')),
        ((select id from users where email = '${adminEmail}'), (select id from permissions where code = 'manage_cc_members')),
        ((select id from users where email = '${adminEmail}'), (select id from permissions where code = 'add_constitution_version'))`,
    );

    //Insert HOT_ADDRESSES
    await queryRunner.query(
      `-- Hot Addresses
          insert into hot_addresses ("id", "user_id", "address", "created_at") values
          (uuid_generate_v4(), (select id from users where email = '${standardUserEmail1}'), '\\x5f232509020946fdabc54f215d123da46035278c2896ef4b547dd746', NOW()),
          (uuid_generate_v4(), (select id from users where email = '${standardUserEmail2}'), '\\xf7e77219a6f50ece3ad55de8144953e80822146f608991843f2399c0', NOW()),
          (uuid_generate_v4(), (select id from users where email = '${standardUserEmail3}'), '\\xc58f07ddaa48109c37bac9d5422e369ae4695fff7d3027caca23573b', NOW())`,
    );

    await queryRunner.query('commit;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('begin;');
    await queryRunner.query('delete from hot_addresses;');
    await queryRunner.query('delete from votes;');
    await queryRunner.query('delete from user_permissions;');
    await queryRunner.query('delete from users;');
    await queryRunner.query('delete from gov_action_proposals;');
    await queryRunner.query('commit;');
  }
}
