import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Packet } from "./Packet";

export type Company = {
  id: number;
  name: string;
  day: string;
  booth: string;
  packets: Packet[];
  totalPackets?: number;
  packetsNotInWarehouse?: number;
};

export class CreateCompanyParams {
  @IsNumber()
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
