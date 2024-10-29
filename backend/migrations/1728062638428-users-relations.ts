import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersRelations1728062638428 implements MigrationInterface {
  name = 'UsersRelations1728062638428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hot_addresses" DROP CONSTRAINT "FK_e125763f26d4736a5701f6c4d4b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hot_addresses" ADD CONSTRAINT "FK_e125763f26d4736a5701f6c4d4b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" ADD CONSTRAINT "FK_27be2cab62274f6876ad6a31641" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rationales" ADD CONSTRAINT "FK_182656ae5052a7efd72a02c64e9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rationales" DROP CONSTRAINT "FK_182656ae5052a7efd72a02c64e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "votes" DROP CONSTRAINT "FK_27be2cab62274f6876ad6a31641"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hot_addresses" DROP CONSTRAINT "FK_e125763f26d4736a5701f6c4d4b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hot_addresses" ADD CONSTRAINT "FK_e125763f26d4736a5701f6c4d4b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
