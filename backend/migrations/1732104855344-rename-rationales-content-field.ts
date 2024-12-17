import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameRationalesContentField1732104855344
  implements MigrationInterface
{
  name = 'RenameRationalesContentField1732104855344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rationales" RENAME COLUMN "content" TO "rationale_statement"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rationales" RENAME COLUMN "rationale_statement" TO "content"`,
    );
  }
}
