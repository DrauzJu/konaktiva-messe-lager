import { IsInt, IsOptional } from "class-validator";
import { Company } from './Company';
import { PacketMovement } from './PacketMovement';

export type Packet = {
  id: number;
  company: Company;
  location: string;
}

export type PacketDetailed = Packet & {
  movements: PacketMovement[];
};

export class CreatePacketParams {
  @IsInt()
  public companyId!: number;

  @IsOptional()
  public location: string | undefined;
}
