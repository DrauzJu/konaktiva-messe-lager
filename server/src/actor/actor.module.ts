import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorController } from './actor.controller';
import { Actor } from './actor.model';
import { ActorService } from './actor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Actor])],
  controllers: [ActorController],
  providers: [ActorService],
})
export class ActorModule {}
