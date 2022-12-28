import { IsOptional } from "class-validator";
import { PacketDto } from "./Packet";

export enum PacketMovementType {
  IN,
  OUT,
  LOCATION_CHANGE
};

export class PacketMovementDto {
  @IsOptional()
  public ID: number;

  public packet: PacketDto;
  public time: Date;
  public type: PacketMovementType;
  public oldLocation: string;
  public newLocation: string;
  public actor: string;

  public constructor(
    ID: number,
    packet: PacketDto,
    time: Date,
    type: PacketMovementType,
    oldLocation: string,
    newLocation: string,
    actor: string,
  ) {
    this.ID = ID;
    this.packet = packet;
    this.time = time;
    this.type = type;
    this.oldLocation = oldLocation;
    this.newLocation = newLocation;
    this.actor = actor;
  }
};
