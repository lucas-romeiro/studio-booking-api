import { Inject, Injectable } from '@nestjs/common';
import {
  InvalidRefreshTokenError,
  IRefreshTokenRepository,
  ITokenPort,
  REFRESH_TOKEN_REPOSITORY,
  RefreshToken,
  TOKEN_PORT,
} from '@/domain/auth';
import {
  IUserRepository,
  USER_REPOSITORY,
  UserNotFoundError,
} from '@/domain/user';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(TOKEN_PORT)
    private readonly tokenPort: ITokenPort,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    const existing = await this.refreshTokenRepository.findByToken(
      dto.refreshToken,
    );

    if (!existing || !existing.isActive || existing.isExpired()) {
      throw new InvalidRefreshTokenError();
    }

    const user = await this.userRepository.findById(existing.userId);

    if (!user) {
      throw new UserNotFoundError(existing.userId);
    }

    existing.revoke();
    await this.refreshTokenRepository.save(existing);

    const accessToken = this.tokenPort.generateAccessToken(user);
    const rawRefreshToken = this.tokenPort.generateRefreshToken();

    const newRefreshToken = RefreshToken.create({
      userId: user.id,
      token: rawRefreshToken,
      expiresAt: this.tokenPort.refreshTokenExpiresAt(),
    });

    await this.refreshTokenRepository.save(newRefreshToken);

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email.toString(),
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }
}
