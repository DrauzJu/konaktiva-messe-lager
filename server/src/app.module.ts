import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PacketModule } from './packet/packet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import getDBConfiguration from './db.conf';
import { PacketMovementModule } from './packet-movement/packet-movement.module';
import { CompanyModule } from './company/company.module';
import { APP_GUARD } from '@nestjs/core';
import { ReadOnlyGuard } from './read-only-guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'dist'),
      serveRoot: '/',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule.forRoot()],
      useFactory: (config: ConfigService) => getDBConfiguration(config),
    }),
    CompanyModule,
    PacketModule,
    PacketMovementModule,
  ],
  controllers: [],
  providers: [
    {
      inject: [ConfigService],
      provide: APP_GUARD,
      useFactory: (config: ConfigService) => new ReadOnlyGuard(config),
    },
  ],
})
export class AppModule {}
