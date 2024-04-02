import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedValues1709813276340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `begin;
            -- Roles
            insert into roles ("id", "code", "created_at") values
            (uuid_generate_v4(), 'user', NOW()),
            (uuid_generate_v4(), 'admin', NOW());
                
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
  }
}
