/* eslint-disable @typescript-eslint/unbound-method */
import { LogoutUseCase, RefreshTokenDto } from '@/application/auth';
import { mockRefreshTokenRepository } from '../../__mocks__';
import { InvalidRefreshTokenError } from '@/domain/auth';
import { RefreshTokenFactory } from '../../__factories__';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
  let dto: RefreshTokenDto;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new LogoutUseCase(mockRefreshTokenRepository);
    dto = {
      refreshToken: 'valid_refresh_token',
    };
  });

  describe('Success Flow', () => {
    it('should revoke and save the token when it is active', async () => {
      const refreshToken = RefreshTokenFactory.make({
        token: dto.refreshToken,
      });
      mockRefreshTokenRepository.findByToken.mockResolvedValue(refreshToken);

      await useCase.execute(dto);

      expect(mockRefreshTokenRepository.findByToken).toHaveBeenCalledWith(
        dto.refreshToken,
      );
      expect(refreshToken.isActive).toBe(false);
      expect(mockRefreshTokenRepository.save).toHaveBeenCalledWith(
        refreshToken,
      );
    });
  });

  describe('Failure Flow', () => {
    it('should throw an InvalidRefreshTokenError if the refresh token does not exist', async () => {
      mockRefreshTokenRepository.findByToken.mockResolvedValue(null);

      await expect(useCase.execute(dto)).rejects.toThrow(
        InvalidRefreshTokenError,
      );
      expect(mockRefreshTokenRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an InvalidRefreshTokenError if the refresh token is already inactive/revoked', async () => {
      const refreshToken = RefreshTokenFactory.makeRevoked({
        token: dto.refreshToken,
      });
      mockRefreshTokenRepository.findByToken.mockResolvedValue(refreshToken);

      await expect(useCase.execute(dto)).rejects.toThrow(
        InvalidRefreshTokenError,
      );
      expect(mockRefreshTokenRepository.save).not.toHaveBeenCalled();
    });
  });
});
