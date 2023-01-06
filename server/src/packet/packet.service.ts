import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePacketParams } from 'messe-lager-dto';
import { Repository } from 'typeorm';
import { Packet } from './packet.model';

@Injectable()
export class PacketService {
  public constructor(
    @InjectRepository(Packet)
    private packetRepository: Repository<Packet>,
  ) {}

  public async getPackets(): Promise<Packet[]> {
    return this.packetRepository.find();
  }

  public async findPacket(id: number): Promise<Packet | null> {
    return this.packetRepository.findOne({
      where: { id },
      relations: ['movements'],
    });
  }

  public async createPacket(data: CreatePacketParams): Promise<Packet> {
    const packet = new Packet();
    packet.location = data.location;
    packet.company = <any>data.companyId;

    return this.packetRepository.save(packet);
  }
}
