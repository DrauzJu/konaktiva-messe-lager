import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePacketParams, PacketMovementType } from 'messe-lager-dto';
import { PacketMovementService } from 'src/packet-movement/packet-movement.service';
import { Repository } from 'typeorm';
import { Packet } from './packet.model';

@Injectable()
export class PacketService {
  public constructor(
    @InjectRepository(Packet)
    private packetRepository: Repository<Packet>,
    @Inject(PacketMovementService)
    private packetMovementService: PacketMovementService,
  ) {}

  public async getPackets(): Promise<Packet[]> {
    return this.packetRepository.find();
  }

  public async findPacket(id: number): Promise<Packet | null> {
    return this.packetRepository.findOne({
      where: { id },
      relations: ['movements'],
      order: {
        movements: {
          time: 'ASC',
        },
      },
    });
  }

  public async createPacket(data: CreatePacketParams): Promise<Packet> {
    const packet = new Packet();
    packet.company = <any>data.companyId;
    const newPacket = await this.packetRepository.save(packet);

    await this.packetMovementService.createPacketMovement({
      time: new Date(),
      type: PacketMovementType.IN,
      actor: undefined,
      newLocation: data.location,
      oldLocation: undefined,
      packetId: newPacket.id,
    });

    return this.packetRepository.findOneOrFail({ where: { id: newPacket.id } });
  }
}
