import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Packet } from 'src/packet/packet.model';
import { PacketMovementController } from './packet-movement-controller';
import { PacketMovement } from './packet-movement.model';
import { PacketMovementService } from './packet-movement.service';

@Module({
  imports: [TypeOrmModule.forFeature([Packet, PacketMovement])],
  controllers: [PacketMovementController],
  providers: [PacketMovementService],
})
export class PacketMovementModule {}
