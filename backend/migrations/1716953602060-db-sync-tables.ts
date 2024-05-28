import { MigrationInterface, QueryRunner } from 'typeorm';

export class DbSyncTables1716953602060 implements MigrationInterface {
  name = 'DbSyncTables1716953602060';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "votes" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "hot_address" character varying NOT NULL, "gov_action_proposal_id" bigint NOT NULL, "vote" character varying NOT NULL, "title" character varying, "comment" character varying, "type" character varying NOT NULL, "gov_metadata_url" character varying NOT NULL, "end_time" TIMESTAMP NOT NULL, "time" TIMESTAMP NOT NULL, CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "governance_metadata" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "voting_anchor_id" bigint NOT NULL, "title" character varying, CONSTRAINT "PK_e7f701a81d4cbcdffe5561a3c0f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "governance_metadata"`);
    await queryRunner.query(`DROP TABLE "votes"`);
  }
}
