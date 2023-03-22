import { IsNotEmpty, IsString } from "class-validator";

export type Actor = {
  id: number;
  name: string;
};

export class CreateActorParams {
  @IsString()
  @IsNotEmpty()
  public name!: string;
};
