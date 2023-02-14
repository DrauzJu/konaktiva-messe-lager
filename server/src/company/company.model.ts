import { Packet } from 'src/packet/packet.model';
import { AfterLoad, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  day: string;

  @Column({ nullable: false })
  booth: string;

  @OneToMany(() => Packet, (packet) => packet.company)
  packets: Packet[];

  totalPackets = 0;
  packetsNotInWarehouse = 0;

  @AfterLoad()
  public calculatePacketStats() {
    if (!this.packets) {
      return;
    }

    this.totalPackets = this.packets.filter(
      (packet) => !packet.isDestroyed,
    ).length;

    this.packetsNotInWarehouse = this.packets.filter(
      (packet) => !packet.isDestroyed && packet.location === null,
    ).length;
  }
}
