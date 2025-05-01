import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CreatePacketParams,
  Packet,
  PacketDetailed,
  UpdatePacketParams,
} from 'messe-lager-dto';
import { PacketService } from './packet.service';

@Controller('packet')
export class PacketController {
  public constructor(private readonly packetService: PacketService) {}

  @Get()
  public async getPackets(@Query('location') location): Promise<Packet[]> {
    if (location) {
      return this.packetService.getPacketsByLocation(location);
    }

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

  @Patch(':id')
  public async updatePacket(
    @Param('id') id: number,
    @Body() dataPlain: UpdatePacketParams,
  ): Promise<void> {
    const data = plainToClass(UpdatePacketParams, dataPlain);

    const validationErrors = await validate(data);
    if (validationErrors.length > 0) {
      throw new HttpException(
        validationErrors[0].toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.packetService.updatePacket(id, data);
  }

  @Delete()
  public async deletePackets(): Promise<void> {
    await this.packetService.deletePackets();
  }
}
