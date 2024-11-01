import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexesToSearchableColumns1727279527027
  implements MigrationInterface
{
  name = 'AddIndexesToSearchableColumns1727279527027';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "users_status_idx" ON "users" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "users_role_id_idx" ON "users" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "roles_code_idx" ON "roles" ("code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "gov_action_status_idx" ON "gov_action_proposals" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "gov_action_type_idx" ON "gov_action_proposals" ("gov_action_type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "votes_user_id_idx" ON "votes" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "votes_gov_action_proposal_id_idx" ON "votes" ("gov_action_proposal_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "votes_vote_idx" ON "votes" ("vote") `,
    );
    await queryRunner.query(
      `ALTER TABLE "rationales" ADD CONSTRAINT "UQ_d2e92e8f049eaa02a6de27bcb48" UNIQUE ("user_id", "gov_action_proposal_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rationales" ADD CONSTRAINT "FK_a5fa1ad294195c3957205a2937a" FOREIGN KEY ("gov_action_proposal_id") REFERENCES "gov_action_proposals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rationales" DROP CONSTRAINT "FK_a5fa1ad294195c3957205a2937a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rationales" DROP CONSTRAINT "UQ_d2e92e8f049eaa02a6de27bcb48"`,
    );
    await queryRunner.query(`DROP INDEX "public"."votes_vote_idx"`);
    await queryRunner.query(
      `DROP INDEX "public"."votes_gov_action_proposal_id_idx"`,
    );
    await queryRunner.query(`DROP INDEX "public"."votes_user_id_idx"`);
    await queryRunner.query(`DROP INDEX "public"."gov_action_type_idx"`);
    await queryRunner.query(`DROP INDEX "public"."gov_action_status_idx"`);
    await queryRunner.query(`DROP INDEX "public"."roles_code_idx"`);
    await queryRunner.query(`DROP INDEX "public"."users_role_id_idx"`);
    await queryRunner.query(`DROP INDEX "public"."users_status_idx"`);
  }
}
