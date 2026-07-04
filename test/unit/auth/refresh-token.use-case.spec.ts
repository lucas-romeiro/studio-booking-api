/* eslint-disable @typescript-eslint/unbound-method */
import { RefreshTokenDto, RefreshTokenUseCase } from '@/application/auth';
import { RefreshTokenFactory, UserFactory } from '../../__factories__';
import {
  mockUserRepository,
  mockRefreshTokenRepository,
  mockTokenPort,
} from '../../__mocks__';
import { InvalidRefreshTokenError } from '@/domain/auth';
import { UserNotFoundError } from '@/domain/user';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let dto: RefreshTokenDto;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RefreshTokenUseCase(
      mockRefreshTokenRepository,
      mockUserRepository,
      mockTokenPort,
    );
    dto = {
      refreshToken: 'valid_refresh_token',
    };
  });

  describe('Success flow', () => {
    it('should revoke old token, persist a new one, and return auth data', async () => {
      const user = UserFactory.make();
      const existingRefreshToken = RefreshTokenFactory.make({
        token: dto.refreshToken,
        userId: user.id,
      });

      mockRefreshTokenRepository.findByToken.mockResolvedValue(
        existingRefreshToken,
      );
      mockUserRepository.findById.mockResolvedValue(user);
      mockRefreshTokenRepository.save.mockResolvedValue(undefined);
      mockTokenPort.generateAccessToken.mockReturnValue('new_access_token');
      mockTokenPort.generateRefreshToken.mockReturnValue('new_refresh_token');
      mockTokenPort.refreshTokenExpiresAt.mockReturnValue(new Date());

      const result = await useCase.execute(dto);

      expect(mockRefreshTokenRepository.save).toHaveBeenCalledTimes(2);
      expect(existingRefreshToken.isActive).toBe(false);
      expect(mockRefreshTokenRepository.save).toHaveBeenNthCalledWith(
        1,
        existingRefreshToken,
      );
      expect(mockRefreshTokenRepository.save).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          token: 'new_refresh_token',
          userId: user.id,
        }),
      );
      expect(result).toEqual({
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
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
    describe('Token Validation', () => {
      it('should throw InvalidRefreshTokenError if token does not exist', async () => {
        mockRefreshTokenRepository.findByToken.mockResolvedValue(null);

        await expect(useCase.execute(dto)).rejects.toThrow(
          InvalidRefreshTokenError,
        );
        expect(mockRefreshTokenRepository.save).not.toHaveBeenCalled();
      });

      it('should throw InvalidRefreshTokenError if token is inactive', async () => {
        const refreshToken = RefreshTokenFactory.makeRevoked({
          token: dto.refreshToken,
        });
        mockRefreshTokenRepository.findByToken.mockResolvedValue(refreshToken);

        await expect(useCase.execute(dto)).rejects.toThrow(
          InvalidRefreshTokenError,
        );
        expect(mockRefreshTokenRepository.save).not.toHaveBeenCalled();
      });

      it('should throw InvalidRefreshTokenError if token is expired', async () => {
        const refreshToken = RefreshTokenFactory.makeExpired({
          token: dto.refreshToken,
        });
        mockRefreshTokenRepository.findByToken.mockResolvedValue(refreshToken);

        await expect(useCase.execute(dto)).rejects.toThrow(
          InvalidRefreshTokenError,
        );
        expect(mockRefreshTokenRepository.save).not.toHaveBeenCalled();
      });
    });

    describe('User validation', () => {
      it('should throw UserNotFoundError if user linked to token does not exist', async () => {
        const refreshToken = RefreshTokenFactory.make({
          token: dto.refreshToken,
        });
        mockRefreshTokenRepository.findByToken.mockResolvedValue(refreshToken);
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(useCase.execute(dto)).rejects.toThrow(UserNotFoundError);
        expect(mockRefreshTokenRepository.save).not.toHaveBeenCalled();
      });
    });
  });
});
