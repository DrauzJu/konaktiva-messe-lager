import { IsDateString, IsEnum, IsNumber, IsOptional } from "class-validator";
import { Packet } from "./Packet";

export enum PacketMovementType {
  IN,
  OUT,
  LOCATION_CHANGE
};

export type PacketMovement = {
  id: number;
  packet: Packet;
  time: Date;
  type: PacketMovementType;
  oldLocation: string;
  newLocation: string;
  actor: string;
};

export class CreatePacketMovementParams {
  @IsNumber()
  public packetId!: number;

  @IsDateString()
  public time!: Date;

  @IsEnum(PacketMovementType)
  public type!: PacketMovementType;

  @IsOptional()
  public oldLocation: string | undefined;

  @IsOptional()
  public newLocation: string | undefined;

  @IsOptional()
  public actor: string | undefined;
};
