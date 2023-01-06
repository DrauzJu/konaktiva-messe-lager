import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1672842167578 implements MigrationInterface {
  name = 'InitialMigration1672842167578';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`company\` (\`id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`day\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`packet_movement\` (\`id\` int NOT NULL AUTO_INCREMENT, \`time\` datetime NOT NULL, \`type\` int NOT NULL, \`oldLocation\` varchar(255) NULL, \`newLocation\` varchar(255) NULL, \`actor\` varchar(255) NULL, \`packetId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`packet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`location\` varchar(255) NULL, \`companyId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`packet_movement\` ADD CONSTRAINT \`FK_cf310da3086f267499496871e46\` FOREIGN KEY (\`packetId\`) REFERENCES \`packet\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`packet\` ADD CONSTRAINT \`FK_028597e0259980d492eb9be3c56\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`packet\` DROP FOREIGN KEY \`FK_028597e0259980d492eb9be3c56\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`packet_movement\` DROP FOREIGN KEY \`FK_cf310da3086f267499496871e46\``,
    );
    await queryRunner.query(`DROP TABLE \`packet\``);
    await queryRunner.query(`DROP TABLE \`packet_movement\``);
    await queryRunner.query(`DROP TABLE \`company\``);
  }
}
