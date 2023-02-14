import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPacketDestroyedFlag1674600946793 implements MigrationInterface {
  name = 'AddPacketDestroyedFlag1674600946793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`packet\` ADD \`isDestroyed\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`packet\` DROP COLUMN \`isDestroyed\``,
    );
  }
}
