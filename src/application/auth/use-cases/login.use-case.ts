import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  InactiveUserError,
  InvalidCredentialsError,
  IRefreshTokenRepository,
  ITokenPort,
  REFRESH_TOKEN_REPOSITORY,
  RefreshToken,
  TOKEN_PORT,
} from '@/domain/auth';
import { IUserRepository, USER_REPOSITORY } from '@/domain/user';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(TOKEN_PORT)
    private readonly tokenPort: ITokenPort,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (!user.isActive) {
      throw new InactiveUserError();
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.tokenPort.generateAccessToken(user);
    const rawRefreshToken = this.tokenPort.generateRefreshToken();

    const refreshToken = RefreshToken.create({
      userId: user.id,
      token: rawRefreshToken,
      expiresAt: this.tokenPort.refreshTokenExpiresAt(),
    });

    await this.refreshTokenRepository.save(refreshToken);

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
