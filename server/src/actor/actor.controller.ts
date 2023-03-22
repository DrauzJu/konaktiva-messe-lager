import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Actor, CreateActorParams } from 'messe-lager-dto';
import { ActorService } from './actor.service';

@Controller('actor')
export class ActorController {
  public constructor(private readonly actorService: ActorService) {}

  @Get()
  public async getActors(): Promise<Actor[]> {
    return this.actorService.getActors();
  }

  @Post()
  public async createActor(
    @Body() dataPlain: CreateActorParams,
  ): Promise<Actor> {
    const data = plainToClass(CreateActorParams, dataPlain);

    const validationErrors = await validate(data);
    if (validationErrors.length > 0) {
      throw new HttpException(
        validationErrors[0].toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.actorService.createActor(data);
  }

  @Delete(':id')
  public async deleteActor(@Param('id') id: number): Promise<void> {
    return this.actorService.deleteActor(id);
  }
}
