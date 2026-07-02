import { RefreshToken } from '../entities/refresh-token.entity';

export const REFRESH_TOKEN_REPOSITORY = Symbol('IRefreshTokenRepository');

export interface IRefreshTokenRepository {
  save(refreshToken: RefreshToken): Promise<void>;
  findByToken(token: string): Promise<RefreshToken | null>;
  revokeAllByUserId(userId: string): Promise<void>;
}
