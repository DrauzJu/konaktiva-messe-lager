import { PacketMovementType } from 'messe-lager-dto';
import { Packet } from 'src/packet/packet.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PacketMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Packet, (packet) => packet.id, { nullable: false })
  packet: Packet;

  @Column()
  time: Date;

  @Column()
  type: PacketMovementType;

  @Column({ nullable: true })
  oldLocation: string;

  @Column({ nullable: true })
  newLocation: string;

  @Column({ nullable: true })
  actor: string;
}
