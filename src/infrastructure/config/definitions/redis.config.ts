import { registerAs } from '@nestjs/config';

export interface RedisConfig {
  port: number;
  host: string;
}

export const redisConfig = registerAs('redis', () => ({
  port: process.env.REDIS_PORT ?? 6379,
  host: process.env.REDIS_HOST ?? 'localhost',
}));
