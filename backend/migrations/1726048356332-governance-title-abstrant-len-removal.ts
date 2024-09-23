import { MigrationInterface, QueryRunner } from 'typeorm';

export class GovTitleAbstractLenRemoval1726048356332
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `begin;
            ALTER TABLE gov_action_proposals 
            ALTER COLUMN title TYPE VARCHAR;

            ALTER TABLE gov_action_proposals 
            alter COLUMN abstract type VARCHAR;
        commit;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `begin;
              ALTER TABLE gov_action_proposals 
              ALTER COLUMN title TYPE VARCHAR(80);
  
              ALTER TABLE gov_action_proposals 
              alter COLUMN abstract type VARCHAR(2500);
          commit;`,
    );
  }
}
