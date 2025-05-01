import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatePacketMovementParams, PacketMovement } from 'messe-lager-dto';
import { PacketMovementService } from './packet-movement.service';

@Controller('packetMovement')
export class PacketMovementController {
  public constructor(
    private readonly packetMovementService: PacketMovementService,
  ) {}

  @Post()
  public async createPacketMovement(
    @Body() dataPlain: CreatePacketMovementParams,
  ): Promise<PacketMovement> {
    const data = plainToClass(CreatePacketMovementParams, dataPlain);

    const validationErrors = await validate(data);
    if (validationErrors.length > 0) {
      throw new HttpException(
        validationErrors[0].toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.packetMovementService.createPacketMovement(data);
  }

  @Delete()
  public async deletePacketMovements(): Promise<void> {
    await this.packetMovementService.deletePacketMovements();
  }
}
