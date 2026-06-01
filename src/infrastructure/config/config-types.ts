import { ConfigType as NestConfigType } from '@nestjs/config';
import { appConfig, databaseConfig } from './definitions';

export interface ConfigType {
  app: NestConfigType<typeof appConfig>;
  database: NestConfigType<typeof databaseConfig>;
}
