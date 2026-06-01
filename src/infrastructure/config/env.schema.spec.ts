import { envSchema } from './env.schema';

type EnvVars = {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  PG_HOST: string;
  PG_PORT: number;
  PG_USER: string;
  PG_PASSWORD: string;
  PG_DATABASE: string;
};

const validEnv: EnvVars = {
  NODE_ENV: 'development',
  PORT: 3000,
  PG_HOST: 'localhost',
  PG_PORT: 5432,
  PG_USER: 'user',
  PG_PASSWORD: 'pass',
  PG_DATABASE: 'db',
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

  it('should apply default value for PG_HOST when missing', () => {
    const { PG_HOST: _, ...rest } = validEnv;

    const { value } = envSchema.validate(rest, { abortEarly: false }) as {
      value: { PG_HOST: string };
    };

    expect(value.PG_HOST).toBe('localhost');
  });

  it('should apply default value for PG_PORT when missing', () => {
    const { PG_PORT: _, ...rest } = validEnv;

    const { value } = envSchema.validate(rest, { abortEarly: false }) as {
      value: { PG_PORT: number };
    };

    expect(value.PG_PORT).toBe(5432);
  });

  it('should fail if PG_USER is missing', () => {
    const { PG_USER: _, ...rest } = validEnv;

    const { error } = envSchema.validate(rest, { abortEarly: false });
    expect(error?.details[0]?.path).toContain('PG_USER');
  });

  it('should fail if PG_PASSWORD is missing', () => {
    const { PG_PASSWORD: _, ...rest } = validEnv;

    const { error } = envSchema.validate(rest, { abortEarly: false });
    expect(error?.details[0]?.path).toContain('PG_PASSWORD');
  });

  it('should fail if PG_DATABASE is missing', () => {
    const { PG_DATABASE: _, ...rest } = validEnv;

    const { error } = envSchema.validate(rest, { abortEarly: false });
    expect(error?.details[0]?.path).toContain('PG_DATABASE');
  });
});
