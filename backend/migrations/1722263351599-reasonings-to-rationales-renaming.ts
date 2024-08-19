import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReasoningsToRationalesRenaming1722263351599
  implements MigrationInterface
{
  name = 'ReasoningsToRationalesRenaming1722263351599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('reasonings', 'rationales');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('rationales', 'reasonings');
  }
}
