import { IsOptional, Length } from 'class-validator';

export class PacketDto {
  @IsOptional()
  id: number;

  @Length(1, 100)
  title: string;
}
