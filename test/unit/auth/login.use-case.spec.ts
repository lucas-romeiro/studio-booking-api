/* eslint-disable @typescript-eslint/unbound-method */
import { LoginDto, LoginUseCase } from '@/application/auth';
import { InactiveUserError, InvalidCredentialsError } from '@/domain/auth';
import { UserFactory } from '../../__factories__';
import {
  mockUserRepository,
  mockRefreshTokenRepository,
  mockTokenPort,
} from '../../__mocks__';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockedBcrypt = jest.mocked(bcrypt);

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let dto: LoginDto;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new LoginUseCase(
      mockUserRepository,
      mockRefreshTokenRepository,
      mockTokenPort,
    );
    dto = {
      email: 'jhon_doe@email.com',
      password: 'password1',
    };
  });

  describe('Success Flow', () => {
    it('should return tokens and user data with valid credentials', async () => {
      const user = UserFactory.make({ email: dto.email });
      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockRefreshTokenRepository.save.mockResolvedValue(undefined);
      mockTokenPort.generateAccessToken.mockReturnValue('access_token');
      mockTokenPort.generateRefreshToken.mockReturnValue('refresh_token');
      mockTokenPort.refreshTokenExpiresAt.mockReturnValue(new Date());
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await useCase.execute(dto);

      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        dto.password,
        user.passwordHash,
      );
      expect(mockRefreshTokenRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          token: 'refresh_token',
          userId: user.id,
        }),
      );
      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        user: {
          id: user.id,
          name: user.name,
          email: user.email.toString(),
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    });
  });

  describe('Failure Flow', () => {
    it('should throw UserNotFoundError with invalid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow(
        InvalidCredentialsError,
      );

      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
      expect(mockTokenPort.generateAccessToken).not.toHaveBeenCalled();
      expect(mockTokenPort.generateRefreshToken).not.toHaveBeenCalled();
      expect(mockTokenPort.refreshTokenExpiresAt).not.toHaveBeenCalled();
      expect(mockRefreshTokenRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an InactiveUserError if user is not active', async () => {
      const user = UserFactory.make();
      user.deactivate();
      mockUserRepository.findByEmail.mockResolvedValue(user);

      await expect(useCase.execute(dto)).rejects.toThrow(InactiveUserError);

      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
      expect(mockTokenPort.generateAccessToken).not.toHaveBeenCalled();
      expect(mockTokenPort.generateRefreshToken).not.toHaveBeenCalled();
      expect(mockTokenPort.refreshTokenExpiresAt).not.toHaveBeenCalled();
      expect(mockRefreshTokenRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an InvalidCredentialsError with an invalid password', async () => {
      const user = UserFactory.make();
      mockUserRepository.findByEmail.mockResolvedValue(user);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(useCase.execute(dto)).rejects.toThrow(
        InvalidCredentialsError,
      );

      expect(mockedBcrypt.compare).toHaveBeenCalledTimes(1);
      expect(mockTokenPort.generateAccessToken).not.toHaveBeenCalled();
      expect(mockTokenPort.generateRefreshToken).not.toHaveBeenCalled();
      expect(mockTokenPort.refreshTokenExpiresAt).not.toHaveBeenCalled();
      expect(mockRefreshTokenRepository.save).not.toHaveBeenCalled();
    });
  });
});
