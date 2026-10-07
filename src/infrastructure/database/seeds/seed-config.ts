import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { validateEnv } from '../../config';
import { SeedEnvConfig } from './seed-env.interface';

dotenv.config();

const seedSchema: Joi.ObjectSchema<SeedEnvConfig> = Joi.object<SeedEnvConfig>({
  SEED_ADMIN_EMAIL: Joi.string().email().required(),
  SEED_ADMIN_PASSWORD: Joi.string().min(6).required(),
  SEED_STAFF_EMAIL: Joi.string().email().required(),
  SEED_STAFF_PASSWORD: Joi.string().min(6).required(),
  SEED_MUSICIAN_EMAIL: Joi.string().email().required(),
  SEED_MUSICIAN_PASSWORD: Joi.string().min(6).required(),
  SEED_RENTER_EMAIL: Joi.string().email().required(),
  SEED_RENTER_PASSWORD: Joi.string().min(6).required(),
}).unknown(true);

const env = validateEnv<SeedEnvConfig>(seedSchema, process.env);

export const seedConfig = {
  admin: {
    email: env.SEED_ADMIN_EMAIL,
    password: env.SEED_ADMIN_PASSWORD,
  },
  staff: {
    email: env.SEED_STAFF_EMAIL,
    password: env.SEED_STAFF_PASSWORD,
  },
  musician: {
    email: env.SEED_MUSICIAN_EMAIL,
    password: env.SEED_MUSICIAN_PASSWORD,
  },
  renter: {
    email: env.SEED_RENTER_EMAIL,
    password: env.SEED_RENTER_PASSWORD,
  },
};
