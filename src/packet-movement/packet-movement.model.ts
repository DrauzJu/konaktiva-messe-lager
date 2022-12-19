import { Packet } from 'src/packet/packet.model';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PacketMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Packet, (packet) => packet.id)
  packet: Packet;
}
