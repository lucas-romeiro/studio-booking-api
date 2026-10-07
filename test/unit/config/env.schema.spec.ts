import { envSchema } from '@/infrastructure/config/env.schema';
import { EnvConfig } from '@/infrastructure/config/env.interface';

const createValidRawEnv = (): Record<string, string> => ({
  NODE_ENV: 'production',
  PORT: '3000',
  DB_USER: 'postgres',
  DB_PASSWORD: 'postgres',
  DB_DATABASE: 'studio-booking-api',
  JWT_SECRET: 'f5jR4LVd25cZaIQ6q0A899T9j5l0K2cSgefqUE0tk6Z',
});

describe('envSchema', () => {
  describe('success flow', () => {
    it('valida env correto e aplica defaults', () => {
      const { error, value } = envSchema.validate(createValidRawEnv(), {
        allowUnknown: true,
      }) as { error: unknown; value: EnvConfig };

      const env = value;

      expect(error).toBeUndefined();
      expect(env.PORT).toBe(3000);
      expect(env.DB_PORT).toBe(5432);
      expect(env).toEqual(
        expect.objectContaining<Partial<EnvConfig>>({
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

    it('aceita NODE_ENV como development', () => {
      const env = { ...createValidRawEnv(), NODE_ENV: 'development' };
      const { error } = envSchema.validate(env, { allowUnknown: true });
      expect(error).toBeUndefined();
    });

    it('aceita NODE_ENV como test', () => {
      const env = { ...createValidRawEnv(), NODE_ENV: 'test' };
      const { error } = envSchema.validate(env, { allowUnknown: true });
      expect(error).toBeUndefined();
    });

    it('aplica default de NODE_ENV quando ausente', () => {
      const rest = createValidRawEnv();
      delete rest.NODE_ENV;

      const { value } = envSchema.validate(rest, {
        allowUnknown: true,
      }) as { value: EnvConfig };

      expect(value.NODE_ENV).toBe('development');
    });
  });

  describe('failure flow', () => {
    it('falha se NODE_ENV for inválido', () => {
      const env = { ...createValidRawEnv(), NODE_ENV: 'staging' };
      const { error } = envSchema.validate(env, { allowUnknown: true });
      expect(error?.details.some((d) => d.path.includes('NODE_ENV'))).toBe(
        true,
      );
    });

    it.each([['DB_USER'], ['DB_PASSWORD'], ['DB_DATABASE'], ['JWT_SECRET']])(
      'falha se campo obrigatório %s estiver ausente',
      (field) => {
        const env: Partial<Record<string, string>> = createValidRawEnv();
        delete env[field];

        const { error } = envSchema.validate(env, {
          abortEarly: false,
          allowUnknown: true,
        });

        expect(error?.details.some((d) => d.path.includes(field))).toBe(true);
      },
    );

    it('falha se JWT_SECRET tiver menos de 32 caracteres', () => {
      const env = { ...createValidRawEnv(), JWT_SECRET: 'curto' };
      const { error } = envSchema.validate(env, { allowUnknown: true });
      expect(error?.details.some((d) => d.path.includes('JWT_SECRET'))).toBe(
        true,
      );
    });

    it('mostra todos os erros quando abortEarly é false', () => {
      const { error } = envSchema.validate(
        { NODE_ENV: 'invalid' },
        { abortEarly: false, allowUnknown: true },
      );
      expect(error?.details.length).toBeGreaterThan(1);
    });
  });
});
