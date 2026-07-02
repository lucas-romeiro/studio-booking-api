import { ITokenPort } from '@/domain/auth';

export const mockTokenPort: jest.Mocked<ITokenPort> = {
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  verifyAccessToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
  refreshTokenExpiresAt: jest.fn(),
};
