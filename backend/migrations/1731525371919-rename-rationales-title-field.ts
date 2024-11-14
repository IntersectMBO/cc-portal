import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameRationalesTitleField1731525371919
  implements MigrationInterface
{
  name = 'RenameRationalesTitleField1731525371919';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rationales" RENAME COLUMN "title" TO "summary"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rationales" RENAME COLUMN "summary" TO "title"`,
    );
  }
}
