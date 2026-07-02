import { ConfigType as NestConfigType } from '@nestjs/config';
import {
  appConfig,
  authConfig,
  databaseConfig,
  redisConfig,
} from './definitions';

export interface ConfigType {
  app: NestConfigType<typeof appConfig>;
  database: NestConfigType<typeof databaseConfig>;
  auth: NestConfigType<typeof authConfig>;
  redis: NestConfigType<typeof redisConfig>;
}
