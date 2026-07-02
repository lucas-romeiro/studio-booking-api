import { Inject, Injectable } from '@nestjs/common';
import { Email, IUserRepository, User, USER_REPOSITORY } from '@/domain/user';
import {
  EmailAlreadyInUseError,
  IRefreshTokenRepository,
  ITokenPort,
  REFRESH_TOKEN_REPOSITORY,
  RefreshToken,
  TOKEN_PORT,
} from '@/domain/auth';
import { SignupDto } from '../dtos/signup.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class SignupUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject(TOKEN_PORT) private readonly tokenPort: ITokenPort,
  ) {}

  async execute(dto: SignupDto): Promise<AuthResponseDto> {
    const alreadyExists = await this.userRepository.exists(dto.email);

    if (alreadyExists) {
      throw new EmailAlreadyInUseError(dto.email);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = User.create({
      name: dto.name,
      email: new Email(dto.email),
      passwordHash,
      role: dto.role,
    });

    await this.userRepository.save(user);

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
