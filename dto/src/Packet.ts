import { IsOptional } from 'class-validator';

export class PacketDto {
  @IsOptional()
  public number?: number;

  public day: string;
  public company: string;
  public location: string;

  public constructor(
    number: number,
    day: string,
    company: string,
    location: string,
  ) {
    this.number = number;
    this.day = day;
    this.company = company;
    this.location = location;
  }
}
