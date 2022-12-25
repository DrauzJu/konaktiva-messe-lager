import Packet from "./Packet";

export enum PacketMovementType {
  IN,
  OUT,
  LOCATION_CHANGE
};

export class PacketMovement {
  public constructor(
    public ID: number,
    public packet: Packet,
    public time: Date,
    public type: PacketMovementType,
    public oldLocation: string,
    public newLocation: string,
    public actor: string,
  ) {}
};

export default PacketMovement;
