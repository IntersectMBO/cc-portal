import { MigrationInterface, QueryRunner } from 'typeorm';

export class Reasoning1718807771194 implements MigrationInterface {
  name = 'Reasoning1718807771194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reasonings" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "user_id" uuid NOT NULL, "gov_action_proposal_id" bigint NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "cid" character varying NOT NULL, "blake2b" character varying NOT NULL, "url" character varying NOT NULL, "json" jsonb NOT NULL, CONSTRAINT "PK_ff38dc62e0ad413f4bcb92e8d40" PRIMARY KEY ("user_id", "gov_action_proposal_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" DROP CONSTRAINT "FK_28dea4c43a3fad90b75fc0da92b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gov_action_proposals" DROP CONSTRAINT "PK_8e9d938a3ef442b812b2c6258d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gov_action_proposals" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gov_action_proposals" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "gov_action_proposals" ADD CONSTRAINT "PK_761fb8cdf90aec7d72873e63e31" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" DROP CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff"`,
    );
    await queryRunner.query(`ALTER TABLE "votes" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "votes" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "votes" ADD CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" DROP COLUMN "gov_action_proposal_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" ADD "gov_action_proposal_id" integer`,
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
      `ALTER TABLE "votes" DROP COLUMN "gov_action_proposal_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" ADD "gov_action_proposal_id" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" DROP CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff"`,
    );
    await queryRunner.query(`ALTER TABLE "votes" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "votes" ADD "id" bigint NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "votes" ADD CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "gov_action_proposals" DROP CONSTRAINT "PK_761fb8cdf90aec7d72873e63e31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gov_action_proposals" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gov_action_proposals" ADD "id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "gov_action_proposals" ADD CONSTRAINT "PK_8e9d938a3ef442b812b2c6258d1" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" ADD CONSTRAINT "FK_28dea4c43a3fad90b75fc0da92b" FOREIGN KEY ("gov_action_proposal_id") REFERENCES "gov_action_proposals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "reasonings"`);
  }
}
