import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/company/company.model';
import { PacketController } from './packet.controller';
import { Packet } from './packet.model';
import { PacketService } from './packet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Packet, Company])],
  controllers: [PacketController],
  providers: [PacketService],
})
export class PacketModule {}
