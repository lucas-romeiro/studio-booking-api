import { envSchema } from '@/infrastructure/config/env.schema';

interface ValidatedEnv {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DB_TYPE: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  JWT_SECRET?: string;
  JWT_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN_DAYS: number;
  REDIS_HOST: string;
  REDIS_PORT: number;
}

describe('envSchema Validation', () => {
  const createValidRawEnv = (): Record<string, string> => ({
    NODE_ENV: 'production',
    PORT: '3000',
    DB_USER: 'root',
    DB_PASSWORD: 'secret_password',
    DB_DATABASE: 'my_app_db',
    JWT_SECRET: 'super_secret_key',
  });

  describe('Success Flow', () => {
    it('should validate a correct env object and apply all defaults and type coercions', () => {
      const rawEnv = createValidRawEnv();

      const { error, value } = envSchema.validate(rawEnv) as {
        error: undefined;
        value: ValidatedEnv;
      };

      expect(error).toBeUndefined();

      expect(value.PORT).toBe(3000);
      expect(value.DB_PORT).toBe(5432);

      expect(value).toEqual(
        expect.objectContaining({
          NODE_ENV: 'production',
          DB_TYPE: 'postgres',
          DB_HOST: 'localhost',
          JWT_EXPIRES_IN: '15m',
          REFRESH_TOKEN_EXPIRES_IN_DAYS: 30,
          REDIS_HOST: 'localhost',
          REDIS_PORT: 6379,
        }),
      );
    });
  });

  describe('Failure Flow', () => {
    it('should fail if NODE_ENV has an invalid option', () => {
      const env = { ...createValidRawEnv(), NODE_ENV: 'staging' };

      const { error } = envSchema.validate(env);

      const hasNodeEnvError = error?.details.some((detail) =>
        detail.path.includes('NODE_ENV'),
      );
      expect(hasNodeEnvError).toBe(true);
    });

    it.each([['DB_USER'], ['DB_PASSWORD'], ['DB_DATABASE']])(
      'should fail if required field %s is missing',
      (field) => {
        const env: Partial<Record<string, string>> = createValidRawEnv();

        delete env[field];

        const { error } = envSchema.validate(env, { abortEarly: false });

        const hasFieldError = error?.details.some((detail) =>
          detail.path.includes(field),
        );
        expect(hasFieldError).toBe(true);
      },
    );
  });
});
