import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatePacketParams, Packet, PacketDetailed } from 'messe-lager-dto';
import { PacketService } from './packet.service';

@Controller('packet')
export class PacketController {
  public constructor(private readonly packetService: PacketService) {}

  @Get()
  public async getPackets(): Promise<Packet[]> {
    return this.packetService.getPackets();
  }

  @Get(':id')
  public async getPacket(@Param('id') id: number): Promise<PacketDetailed> {
    const packet = await this.packetService.findPacket(id);
    if (packet === null) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return packet;
  }

  @Post()
  public async createPacket(
    @Body() dataPlain: CreatePacketParams,
  ): Promise<Packet> {
    const data = plainToClass(CreatePacketParams, dataPlain);

    const validationErrors = await validate(data);
    if (validationErrors.length > 0) {
      throw new HttpException(
        validationErrors[0].toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.packetService.createPacket(data);
  }
}
