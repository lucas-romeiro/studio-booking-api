import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  PG_HOST: Joi.string().default('localhost'),
  PG_PORT: Joi.number().default(5432),
  PG_USER: Joi.string().required(),
  PG_PASSWORD: Joi.string().required(),
  PG_DATABASE: Joi.string().required(),
});
