import { registerAs } from '@nestjs/config';
import { StringValue } from 'ms';

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: StringValue;
  refreshTokenExpiresInDays: number;
}

export const authConfig = registerAs(
  'auth',
  (): AuthConfig => ({
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: (process.env.JWT_EXPIRES_IN ?? '15m') as StringValue,
    refreshTokenExpiresInDays: parseInt(
      process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS ?? '30',
      10,
    ),
  }),
);
