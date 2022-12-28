import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { PacketMovementSubscriber } from './packet-movement/packet-movement-subscriber';
import { PacketMovement } from './packet-movement/packet-movement.model';
import { Packet } from './packet/packet.model';

const getDBConfiguration = (config: ConfigService): DataSourceOptions => {
  return {
    type: 'mysql',
    url: config.getOrThrow<string>('DATABASE_URL'),
    entities: [Packet, PacketMovement],
    subscribers: [PacketMovementSubscriber],
    migrationsRun: true,
    migrations: ['dist/migrations/*.js'],
  };
};

export default getDBConfiguration;
