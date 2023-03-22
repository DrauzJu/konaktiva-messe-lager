import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateActorParams } from 'messe-lager-dto';
import { Repository } from 'typeorm';
import { Actor } from './actor.model';

@Injectable()
export class ActorService {
  public constructor(
    @InjectRepository(Actor)
    private actorRepository: Repository<Actor>,
  ) {}

  public async getActors(): Promise<Actor[]> {
    return this.actorRepository.find({ order: { name: 'ASC' } });
  }

  public async createActor(data: CreateActorParams): Promise<Actor> {
    const actor = new Actor();
    actor.name = data.name;

    return this.actorRepository.save(actor);
  }

  public async deleteActor(id: number): Promise<void> {
    const actor = await this.actorRepository.findOneBy({ id });
    if (!actor) {
      throw new HttpException(
        `Actor with id ${id} not found!`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.actorRepository.delete(id);
  }
}
