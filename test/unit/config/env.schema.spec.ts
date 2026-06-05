import { envSchema } from '@/infrastructure/config/env.schema';

type EnvVars = {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
};

const validEnv: EnvVars = {
  NODE_ENV: 'development',
  PORT: 3000,
  DB_HOST: 'localhost',
  DB_PORT: 5432,
  DB_USER: 'user',
  DB_PASSWORD: 'pass',
  DB_DATABASE: 'db',
};

describe('envSchema', () => {
  it('should validate a complete and valid environment', () => {
    const { error } = envSchema.validate(validEnv, { abortEarly: false });
    expect(error).toBeUndefined();
  });

  it('should fail if NODE_ENV has an invalid value', () => {
    const env = { ...validEnv, NODE_ENV: 'staging' };

    const { error } = envSchema.validate(env, { abortEarly: false });

    expect(error?.details[0]?.path).toContain('NODE_ENV');
  });

  it('should apply default value for PORT when missing', () => {
    const { PORT: _, ...rest } = validEnv;

    const { value } = envSchema.validate(rest, { abortEarly: false }) as {
      value: { PORT: number };
    };

    expect(value.PORT).toBe(3000);
  });

  it('should apply default value for DB_HOST when missing', () => {
    const { DB_HOST: _, ...rest } = validEnv;

    const { value } = envSchema.validate(rest, { abortEarly: false }) as {
      value: { DB_HOST: string };
    };

    expect(value.DB_HOST).toBe('localhost');
  });

  it('should apply default value for DB_PORT when missing', () => {
    const { DB_PORT: _, ...rest } = validEnv;

    const { value } = envSchema.validate(rest, { abortEarly: false }) as {
      value: { DB_PORT: number };
    };

    expect(value.DB_PORT).toBe(5432);
  });

  it('should fail if DB_USER is missing', () => {
    const { DB_USER: _, ...rest } = validEnv;

    const { error } = envSchema.validate(rest, { abortEarly: false });
    expect(error?.details[0]?.path).toContain('DB_USER');
  });

  it('should fail if DB_PASSWORD is missing', () => {
    const { DB_PASSWORD: _, ...rest } = validEnv;

    const { error } = envSchema.validate(rest, { abortEarly: false });
    expect(error?.details[0]?.path).toContain('DB_PASSWORD');
  });

  it('should fail if DB_DATABASE is missing', () => {
    const { DB_DATABASE: _, ...rest } = validEnv;

    const { error } = envSchema.validate(rest, { abortEarly: false });
    expect(error?.details[0]?.path).toContain('DB_DATABASE');
  });
});
