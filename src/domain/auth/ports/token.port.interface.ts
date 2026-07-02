import { User } from '../../user';

export const TOKEN_PORT = Symbol('ITokenPort');

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface ITokenPort {
  generateAccessToken(user: User): string;
  generateRefreshToken(): string;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): boolean;
  refreshTokenExpiresAt(): Date;
}
