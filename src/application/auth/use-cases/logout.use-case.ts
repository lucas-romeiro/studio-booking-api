import { Inject, Injectable } from '@nestjs/common';
import {
  IRefreshTokenRepository,
  REFRESH_TOKEN_REPOSITORY,
  InvalidRefreshTokenError,
} from '@/domain/auth';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<void> {
    const existing = await this.refreshTokenRepository.findByToken(
      dto.refreshToken,
    );

    if (!existing || !existing.isActive) {
      throw new InvalidRefreshTokenError();
    }

    existing.revoke();
    await this.refreshTokenRepository.save(existing);
  }
}
