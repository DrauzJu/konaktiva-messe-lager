import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PacketDetailed } from "./Packet";

export type Company = {
  id: number;
  name: string;
  day: string;
  booth: string;
  packets: PacketDetailed[];
  totalPackets?: number;
  packetsNotInWarehouse?: number;
};

export class CreateCompanyParams {
  @IsNumber()
  @Type(() => Number)
  public id!: number;

  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsString()
  @IsNotEmpty()
  public day!: string;

  @IsString()
  @IsNotEmpty()
  public booth!: string;
};

export class BatchCreateFromCSVParams {
  public data!: string;
}