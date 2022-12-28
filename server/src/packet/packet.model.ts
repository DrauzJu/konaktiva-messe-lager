import { PacketMovement } from 'src/packet-movement/packet-movement.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Packet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => PacketMovement, (movement) => movement.packet)
  movements: PacketMovement[];
}
