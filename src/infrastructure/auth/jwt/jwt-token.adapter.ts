import { ITokenPort, TokenPayload } from '@/domain/auth';
import { User } from '@/domain/user';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from '../../config/definitions';
import { TypedConfigService } from '../../config';
import * as crypto from 'crypto';

@Injectable()
export class JwtTokenAdapter implements ITokenPort {
  private readonly authConfig: AuthConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: TypedConfigService,
  ) {
    this.authConfig = configService.get<AuthConfig>('auth');
  }

  generateAccessToken(user: User): string {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email.toString(),
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  verifyAccessToken(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token);
  }

  verifyRefreshToken(_token: string): boolean {
    return true;
  }

  refreshTokenExpiresAt(): Date {
    const days = this.authConfig.refreshTokenExpiresInDays ?? 30;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }
}
