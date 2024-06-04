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
          (uuid_generate_v4(), (select id from users where email = '${standardUserEmail1}'), 'addr1qxytft7ul8n43n49yvxphapywyzhu4qjtesjpejtaq9lmm397jhc83dud9v2ps6y2sr0l0apnac8jp8sjstr8hgk3cysl52ccl', NOW()),
          (uuid_generate_v4(), (select id from users where email = '${standardUserEmail2}'), 'addr1qxfqj8k3a09tmhgcju89rm7sh2h56xdkm6nj4qjf9flk8cculz0jmmjxx7tck3jjuvh7wmauj483nhvs5tacn6e577gqfwhq26', NOW()),
          (uuid_generate_v4(), (select id from users where email = '${standardUserEmail3}'), 'addr1q87y5vlc3xgh9h2kak2h6f7cues65a9mwqhh83ur3tkafq3r5930ec6d89ha0wy6098tad4gflx7q7tckwudngw4ge4qlsjt45', NOW())`,
    );

    //Insert GOV_ACTION_PROPOSALS
    await queryRunner.query(
      `-- Gov Action Proposals
            insert into gov_action_proposals ("id", "voting_anchor_id", "title", "abstract", "gov_metadata_url", "created_at") values
            (1, 1, 'First Proposal', 'This is an abstract for the first proposal','some://metadata1.url', NOW()),
            (2, 2, 'Second Proposal', 'This is an abstract for the second proposal', 'some://metadata2.url', NOW()),
            (3, 3, 'Third Proposal', 'This is an abstract for the third proposal', 'some://metadata3.url', NOW())`,
    );

    //Insert VOTES
    await queryRunner.query(
      `-- Votes
            insert into votes ("id", "user_id","gov_action_proposal_id", "hot_address", "vote", "title", "comment", "gov_action_type", "end_time", "submit_time") values
            (uuid_generate_v4()
            ,(select id from users where email = '${standardUserEmail1}')
            ,(select id from gov_action_proposals where title = 'First Proposal')
            ,(select address from hot_addresses where user_id = (select id from users where email = '${standardUserEmail1}'))
            ,'YES'
            ,'This is my reasoning title'
            ,'This is my reasoning comment'
            ,'NewConstitution'
            ,NOW() + INTERVAL '10 DAYS'
            ,NOW()),

            (uuid_generate_v4()
            ,(select id from users where email = '${standardUserEmail2}')
            ,(select id from gov_action_proposals where title = 'First Proposal')
            ,(select address from hot_addresses where user_id = (select id from users where email = '${standardUserEmail2}'))
            ,'NO'
            ,'This is my reasoning title'
            ,'This is my reasoning comment'
            ,'NewConstitution'
            ,NOW() + INTERVAL '10 DAYS'
            ,NOW()),

            (uuid_generate_v4()
            ,(select id from users where email = '${standardUserEmail3}')
            ,(select id from gov_action_proposals where title = 'First Proposal')
            ,(select address from hot_addresses where user_id = (select id from users where email = '${standardUserEmail3}'))
            ,'ABSTAIN'
            ,'This is my reasoning title'
            ,'This is my reasoning comment'
            ,'NewConstitution'
            ,NOW() + INTERVAL '10 DAYS'
            ,NOW()),

            (uuid_generate_v4()
            ,(select id from users where email = '${standardUserEmail1}')
            ,(select id from gov_action_proposals where title = 'Second Proposal')
            ,(select address from hot_addresses where user_id = (select id from users where email = '${standardUserEmail1}'))
            ,'NO'
            ,'This is my reasoning title'
            ,'This is my reasoning comment'
            ,'TreasuryWithdrawals'
            ,NOW() + INTERVAL '12 DAYS'
            ,NOW()),

            (uuid_generate_v4()
            ,(select id from users where email = '${standardUserEmail2}')
            ,(select id from gov_action_proposals where title = 'Second Proposal')
            ,(select address from hot_addresses where user_id = (select id from users where email = '${standardUserEmail2}'))
            ,'YES'
            ,'This is my reasoning title'
            ,'This is my reasoning comment'
            ,'TreasuryWithdrawals'
            ,NOW() + INTERVAL '12 DAYS'
            ,NOW()),

            (uuid_generate_v4()
            ,(select id from users where email = '${standardUserEmail3}')
            ,(select id from gov_action_proposals where title = 'Second Proposal')
            ,(select address from hot_addresses where user_id = (select id from users where email = '${standardUserEmail3}'))
            ,'ABSTAIN'
            ,'This is my reasoning title'
            ,'This is my reasoning comment'
            ,'TreasuryWithdrawals'
            ,NOW() + INTERVAL '12 DAYS'
            ,NOW()),

            (uuid_generate_v4()
            ,(select id from users where email = '${standardUserEmail1}')
            ,(select id from gov_action_proposals where title = 'Third Proposal')
            ,(select address from hot_addresses where user_id = (select id from users where email = '${standardUserEmail1}'))
            ,'YES'
            ,'This is my reasoning title'
            ,'This is my reasoning comment'
            ,'ParameterChange'
            ,NOW() - INTERVAL '2 DAYS'
            ,NOW()),

            (uuid_generate_v4()
            ,(select id from users where email = '${standardUserEmail3}')
            ,(select id from gov_action_proposals where title = 'Third Proposal')
            ,(select address from hot_addresses where user_id = (select id from users where email = '${standardUserEmail3}'))
            ,'NO'
            ,'This is my reasoning title'
            ,'This is my reasoning comment'
            ,'ParameterChange'
            ,NOW() - INTERVAL '2 DAYS'
            ,NOW())
            `,
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
