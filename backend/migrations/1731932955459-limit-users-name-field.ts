import { MigrationInterface, QueryRunner } from 'typeorm';

export class LimitUsersNameField1731932955459 implements MigrationInterface {
  name = 'LimitUsersNameField1731932955459';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "name" TYPE varchar(64)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "name" TYPE varchar(50)`,
    );
  }
}
