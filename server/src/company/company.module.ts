import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CsvModule } from 'nest-csv-parser';
import { Company } from 'src/company/company.model';
import { Packet } from 'src/packet/packet.model';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Packet]), CsvModule],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
