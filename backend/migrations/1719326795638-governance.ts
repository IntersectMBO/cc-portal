import { MigrationInterface, QueryRunner } from 'typeorm';

export class Governance1719326795638 implements MigrationInterface {
  name = 'Governance1719326795638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gov_action_proposals" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "id" bigint NOT NULL, "tx_hash" character varying NOT NULL, "voting_anchor_id" bigint NOT NULL, "title" character varying(80), "abstract" character varying(2500), "gov_metadata_url" character varying NOT NULL, "status" character varying NOT NULL, "gov_action_type" character varying NOT NULL, "end_time" TIMESTAMP NOT NULL, CONSTRAINT "PK_761fb8cdf90aec7d72873e63e31" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "votes" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "id" bigint NOT NULL, "user_id" uuid NOT NULL, "hot_address" character varying NOT NULL, "vote" character varying NOT NULL, "title" character varying, "comment" character varying, "submit_time" TIMESTAMP NOT NULL, "gov_action_proposal_id" bigint, CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reasonings" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "user_id" uuid NOT NULL, "gov_action_proposal_id" bigint NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "cid" character varying NOT NULL, "blake2b" character varying NOT NULL, "url" character varying NOT NULL, "json" jsonb NOT NULL, CONSTRAINT "UQ_61a4f9b3b5caa8f10937161619a" UNIQUE ("user_id", "gov_action_proposal_id"), CONSTRAINT "PK_61a4f9b3b5caa8f10937161619a" PRIMARY KEY ("user_id", "gov_action_proposal_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" ADD CONSTRAINT "FK_28dea4c43a3fad90b75fc0da92b" FOREIGN KEY ("gov_action_proposal_id") REFERENCES "gov_action_proposals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "votes" DROP CONSTRAINT "FK_28dea4c43a3fad90b75fc0da92b"`,
    );
    await queryRunner.query(`DROP TABLE "reasonings"`);
    await queryRunner.query(`DROP TABLE "votes"`);
    await queryRunner.query(`DROP TABLE "gov_action_proposals"`);
  }
}
