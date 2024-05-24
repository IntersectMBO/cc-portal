import { MigrationInterface, QueryRunner } from 'typeorm';

export class DbSyncTables1716395423762 implements MigrationInterface {
  name = 'DbSyncTables1716395423762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "votes" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "hot_address" character varying NOT NULL, "gov_action_proposal_id" character varying NOT NULL, "vote" character varying NOT NULL, "title" character varying, "comment" character varying, "type" character varying NOT NULL, "end_time" TIMESTAMP NOT NULL, "time" TIMESTAMP NOT NULL, CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "votes"`);
  }
}
