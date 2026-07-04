/* eslint-disable @typescript-eslint/unbound-method */
import { SignupDto, SignupUseCase } from '@/application/auth';
import {
  mockUserRepository,
  mockRefreshTokenRepository,
  mockTokenPort,
} from '../../__mocks__';
import { EmailAlreadyInUseError } from '@/domain/auth';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockedBcrypt = jest.mocked(bcrypt);

describe('SignupUseCase', () => {
  let useCase: SignupUseCase;
  let dto: SignupDto;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SignupUseCase(
      mockUserRepository,
      mockRefreshTokenRepository,
      mockTokenPort,
    );

    dto = {
      name: 'Jhon Doe',
      email: 'john_doe@email.com',
      password: 'password1',
    };
  });

  describe('Success Flow', () => {
    it('should create a user, persist both user and refresh token, and return auth response', async () => {
      mockUserRepository.exists.mockResolvedValue(false);
      mockUserRepository.save.mockResolvedValue(undefined);
      mockRefreshTokenRepository.save.mockResolvedValue(undefined);
      mockTokenPort.generateAccessToken.mockReturnValue('access_token');
      mockTokenPort.generateRefreshToken.mockReturnValue('refresh_token');
      mockTokenPort.refreshTokenExpiresAt.mockReturnValue(new Date());
      mockedBcrypt.hash.mockImplementation(() => 'hashed_password');

      const result = await useCase.execute(dto);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: dto.name,
          passwordHash: 'hashed_password',
        }),
      );
      expect(mockRefreshTokenRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          token: 'refresh_token',
          userId: result.user.id,
        }),
      );
      expect(result.accessToken).toBe('access_token');
      expect(result.refreshToken).toBe('refresh_token');
      expect(result.user).toEqual(
        expect.objectContaining({
          name: dto.name,
          email: dto.email,
        }),
      );
    });
  });

  describe('Failure Flow', () => {
    it('should throw EmailAlreadyInUseError if email already registered', async () => {
      mockUserRepository.exists.mockResolvedValue(true);

      await expect(useCase.execute(dto)).rejects.toThrow(
        EmailAlreadyInUseError,
      );

      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      expect(mockTokenPort.generateAccessToken).not.toHaveBeenCalled();
      expect(mockTokenPort.generateRefreshToken).not.toHaveBeenCalled();
      expect(mockTokenPort.refreshTokenExpiresAt).not.toHaveBeenCalled();
      expect(mockRefreshTokenRepository.save).not.toHaveBeenCalled();
    });
  });
});
