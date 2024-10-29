import { MigrationInterface, QueryRunner } from 'typeorm';

export class VoteMetadataUrl1729504273717 implements MigrationInterface {
  name = 'VoteMetadataUrl1729504273717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "votes" ADD "vote_metadata_url" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "votes" DROP COLUMN "vote_metadata_url"`,
    );
  }
}
