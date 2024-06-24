import { MigrationInterface, QueryRunner } from 'typeorm';

export class Reasoning1719232678181 implements MigrationInterface {
  name = 'Reasoning1719232678181';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reasonings" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "cid" character varying NOT NULL, "blake2b" character varying NOT NULL, "url" character varying NOT NULL, "json" jsonb NOT NULL, "gov_action_proposal_id" bigint NOT NULL, CONSTRAINT "UQ_61a4f9b3b5caa8f10937161619a" UNIQUE ("user_id", "gov_action_proposal_id"), CONSTRAINT "PK_ff38dc62e0ad413f4bcb92e8d40" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reasonings"`);
  }
}
