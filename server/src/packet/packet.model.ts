import { CreatePacketParams } from 'messe-lager-dto/dist/Packet';
import { Company } from 'src/company/company.model';
import { PacketMovement } from 'src/packet-movement/packet-movement.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Packet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.id, {
    nullable: false,
    eager: true,
  })
  company: Company;

  @Column({ nullable: true })
  location: string;

  @OneToMany(() => PacketMovement, (movement) => movement.packet)
  movements: PacketMovement[];
}
