import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPacketComment1679496810477 implements MigrationInterface {
  name = 'AddPacketComment1679496810477';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`packet\` ADD \`comment\` text NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`packet\` DROP COLUMN \`comment\``);
  }
}
