import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/company/company.model';
import { PacketMovementModule } from 'src/packet-movement/packet-movement.module';
import { PacketController } from './packet.controller';
import { Packet } from './packet.model';
import { PacketService } from './packet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Packet, Company]), PacketMovementModule],
  controllers: [PacketController],
  providers: [PacketService],
})
export class PacketModule {}
