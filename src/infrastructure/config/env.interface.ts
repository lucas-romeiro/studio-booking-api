export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;

  DB_TYPE: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN_DAYS: number;

  REDIS_HOST: string;
  REDIS_PORT: number;
}
