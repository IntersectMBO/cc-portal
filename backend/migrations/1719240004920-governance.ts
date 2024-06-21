import { MigrationInterface, QueryRunner } from 'typeorm';

export class Governance1719240004920 implements MigrationInterface {
  name = 'Governance1719240004920';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gov_action_proposals" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "id" bigint NOT NULL, "tx_hash" character varying NOT NULL, "voting_anchor_id" bigint NOT NULL, "title" character varying(80), "abstract" character varying(2500), "gov_metadata_url" character varying NOT NULL, "status" character varying NOT NULL, "gov_action_type" character varying NOT NULL, "end_time" TIMESTAMP NOT NULL, CONSTRAINT "PK_761fb8cdf90aec7d72873e63e31" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasonings" ADD CONSTRAINT "FK_4aa195e062f6f7c0853376a2444" FOREIGN KEY ("gov_action_proposal_id") REFERENCES "gov_action_proposals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" ADD CONSTRAINT "FK_28dea4c43a3fad90b75fc0da92b" FOREIGN KEY ("gov_action_proposal_id") REFERENCES "gov_action_proposals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "votes" DROP CONSTRAINT "FK_28dea4c43a3fad90b75fc0da92b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reasonings" DROP CONSTRAINT "FK_4aa195e062f6f7c0853376a2444"`,
    );
    await queryRunner.query(`DROP TABLE "gov_action_proposals"`);
  }
}
