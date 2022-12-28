import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Packet } from './packet.model';

@Injectable()
export class PacketService {
  public constructor(
    @InjectRepository(Packet)
    private packetRepository: Repository<Packet>,
  ) {}

  public async getPackets(): Promise<Packet[]> {
    return await this.packetRepository.find();
  }
}
