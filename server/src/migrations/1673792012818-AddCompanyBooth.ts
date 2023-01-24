import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompanyBooth1673792012818 implements MigrationInterface {
    name = 'AddCompanyBooth1673792012818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`packet_movement\` DROP FOREIGN KEY \`FK_cf310da3086f267499496871e46\``);
        await queryRunner.query(`ALTER TABLE \`packet\` DROP FOREIGN KEY \`FK_028597e0259980d492eb9be3c56\``);
        await queryRunner.query(`ALTER TABLE \`company\` ADD \`booth\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`packet_movement\` ADD CONSTRAINT \`FK_cf310da3086f267499496871e46\` FOREIGN KEY (\`packetId\`) REFERENCES \`packet\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`packet\` ADD CONSTRAINT \`FK_028597e0259980d492eb9be3c56\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`packet\` DROP FOREIGN KEY \`FK_028597e0259980d492eb9be3c56\``);
        await queryRunner.query(`ALTER TABLE \`packet_movement\` DROP FOREIGN KEY \`FK_cf310da3086f267499496871e46\``);
        await queryRunner.query(`ALTER TABLE \`company\` DROP COLUMN \`booth\``);
        await queryRunner.query(`ALTER TABLE \`packet\` ADD CONSTRAINT \`FK_028597e0259980d492eb9be3c56\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`packet_movement\` ADD CONSTRAINT \`FK_cf310da3086f267499496871e46\` FOREIGN KEY (\`packetId\`) REFERENCES \`packet\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
