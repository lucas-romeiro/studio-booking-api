import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { envSchema } from '../config/env.schema';
import {
  EquipmentOrmEntity,
  RefreshTokenOrmEntity,
  RoomOrmEntity,
  UserOrmEntity,
} from './typeorm';
import { EnvConfig, validateEnv } from '../config';

dotenv.config();

const env = validateEnv<EnvConfig>(envSchema, process.env);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  synchronize: env.NODE_ENV !== 'production',
  logging: env.NODE_ENV === 'development',
  entities: [
    UserOrmEntity,
    RoomOrmEntity,
    EquipmentOrmEntity,
    RefreshTokenOrmEntity,
  ],
  migrations: ['src/infrastructure/database/migrations/*.ts'],
});
