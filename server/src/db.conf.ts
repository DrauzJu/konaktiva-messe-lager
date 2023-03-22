import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { PacketMovementSubscriber } from './packet-movement/packet-movement-subscriber';
import { PacketMovement } from './packet-movement/packet-movement.model';
import { Company } from './company/company.model';
import { Packet } from './packet/packet.model';
import { Actor } from './actor/actor.model';

const getDBConfiguration = (config: ConfigService): DataSourceOptions => {
  return {
    type: 'mysql',
    url: config.getOrThrow<string>('DATABASE_URL'),
    entities: [Packet, PacketMovement, Company, Actor],
    subscribers: [PacketMovementSubscriber],
    migrationsRun: true,
    migrations: ['dist/migrations/*.js'],
  };
};

export default getDBConfiguration;
