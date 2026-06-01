import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

export const databaseConfig = registerAs(
  'database',
  (): DatabaseConfig => ({
    host: process.env.PG_HOST ?? 'localhost',
    port: parseInt(process.env.PG_PORT ?? '5432', 10),
    username: process.env.PG_USER ?? 'postgres',
    password: process.env.PG_PASSWORD ?? 'postgres',
    database: process.env.PG_DATABASE ?? 'studio_booking',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  }),
);
