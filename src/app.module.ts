import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PacketModule } from './packet/packet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import getDBConfiguration from './db.conf';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'dist'),
      serveRoot: '/',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule.forRoot()],
      useFactory: (config: ConfigService) => getDBConfiguration(config),
    }),
    PacketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
