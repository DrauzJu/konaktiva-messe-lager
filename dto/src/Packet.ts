import { IsInt, IsOptional, IsString } from "class-validator";
import { Company } from './Company';
import { PacketMovement } from './PacketMovement';

export type Packet = {
  id: number;
  company: Company;
  location: string;
  isDestroyed: boolean;
  comment: string | undefined;
}

export type PacketDetailed = Packet & {
  movements: PacketMovement[];
};

export class CreatePacketParams {
  @IsInt()
  public companyId!: number;

  @IsOptional()
  public location: string | undefined;

  @IsOptional()
  public comment: string | undefined;
}

export class UpdatePacketParams {
  @IsString()
  public comment!: string;
}
