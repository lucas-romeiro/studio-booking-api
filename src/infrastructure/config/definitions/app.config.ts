import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: string;
  nodeEnv: string;
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    port: process.env.PORT ?? '3000',
    nodeEnv: process.env.NODE_ENV ?? 'development',
  }),
);
