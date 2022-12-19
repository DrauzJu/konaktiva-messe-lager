import { Controller, Get } from '@nestjs/common';
import { Packet } from './packet.model';
import { PacketService } from './packet.service';

@Controller('packet')
export class PacketController {
  public constructor(private readonly packetService: PacketService) {}

  @Get()
  public async getPackets(): Promise<Packet[]> {
    return await this.packetService.getPackets();
  }
}
