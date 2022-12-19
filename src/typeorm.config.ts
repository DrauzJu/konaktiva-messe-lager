import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import getDBConfiguration from './db.conf';

config();

const configService = new ConfigService();

export default new DataSource(getDBConfiguration(configService));
