import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export type Company = {
  id: number;
  name: string;
  day: string;
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
};
