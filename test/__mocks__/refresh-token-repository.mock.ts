import { IRefreshTokenRepository } from '../../src/domain/auth';

export const mockRefreshTokenRepository: jest.Mocked<IRefreshTokenRepository> =
  {
    save: jest.fn(),
    findByToken: jest.fn(),
    revokeAllByUserId: jest.fn(),
  };
