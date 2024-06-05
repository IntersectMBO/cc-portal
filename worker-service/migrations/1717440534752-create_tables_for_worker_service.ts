import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablesForWorkerService1717440534752
  implements MigrationInterface
{
  name = 'CreateTablesForWorkerService1717440534752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gov_action_proposal" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "id" bigint NOT NULL, "voting_anchor_id" bigint NOT NULL, "title" character varying(80), "abstract" character varying(2500), "gov_metadata_url" character varying NOT NULL, CONSTRAINT "PK_8e9d938a3ef442b812b2c6258d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "votes" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "id" bigint NOT NULL, "user_id" uuid NOT NULL, "hot_address" character varying NOT NULL, "vote" character varying NOT NULL, "title" character varying, "comment" character varying, "gov_action_type" character varying NOT NULL, "end_time" TIMESTAMP NOT NULL, "submit_time" TIMESTAMP NOT NULL, "gov_action_proposal_id" bigint, CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" ADD CONSTRAINT "FK_28dea4c43a3fad90b75fc0da92b" FOREIGN KEY ("gov_action_proposal_id") REFERENCES "gov_action_proposal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "votes" DROP CONSTRAINT "FK_28dea4c43a3fad90b75fc0da92b"`,
    );
    await queryRunner.query(`DROP TABLE "votes"`);
    await queryRunner.query(`DROP TABLE "gov_action_proposal"`);
  }
}
