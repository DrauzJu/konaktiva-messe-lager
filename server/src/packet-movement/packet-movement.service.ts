import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreatePacketMovementParams,
  PacketMovementType,
} from 'messe-lager-dto';
import { Packet } from 'src/packet/packet.model';
import { Repository } from 'typeorm';
import { PacketMovement } from './packet-movement.model';

@Injectable()
export class PacketMovementService {
  public constructor(
    @InjectRepository(PacketMovement)
    private packetMovementRepository: Repository<PacketMovement>,
    @InjectRepository(Packet)
    private packetRepository: Repository<Packet>,
  ) {}

  public async createPacketMovement(
    data: CreatePacketMovementParams,
  ): Promise<PacketMovement> {
    const packet = await this.packetRepository.findOneBy({
      id: data.packetId,
    });

    if (packet === null) {
      throw new HttpException('Invalid Packet ID!', HttpStatus.BAD_REQUEST);
    }

    if (packet.location !== null) {
      if (data.type === PacketMovementType.IN) {
        throw new HttpException(
          'Packet is already in warehouse!',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (
      data.type === PacketMovementType.OUT ||
      data.type === PacketMovementType.LOCATION_CHANGE
    ) {
      throw new HttpException(
        'Packet is not in warehouse!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const movement = new PacketMovement();
    movement.packet = packet;
    movement.time = data.time;
    movement.type = data.type;
    movement.oldLocation = data.oldLocation;
    movement.newLocation = data.newLocation;
    movement.actor = data.actor;

    return this.packetMovementRepository.save(movement);
  }
}
