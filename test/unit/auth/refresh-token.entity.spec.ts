import { RefreshToken } from '@/domain/auth';
import { DomainError } from '../../../src/domain/shared';

describe('RefreshTokenEntity', () => {
  const createValidProps = () => ({
    userId: 'user_Id',
    token: 'valid_refresh_token',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
  });

  describe('create', () => {
    it('should instantiate a new refresh token with correct properties and auto-generated data', () => {
      const props = createValidProps();

      const refreshToken = RefreshToken.create(props);

      expect(refreshToken.id).toBeDefined();
      expect(refreshToken.userId).toBe(props.userId);
      expect(refreshToken.token).toBe(props.token);
      expect(refreshToken.expiresAt).toBe(props.expiresAt);
      expect(refreshToken.createdAt).toBeInstanceOf(Date);
      expect(refreshToken.isActive).toBe(true);
    });
  });

  describe('restore', () => {
    it('should reconstitute an existing refresh token from database data', () => {
      const dbProps = {
        id: 'uuid',
        userId: 'user_id',
        token: 'stored_token',
        expiresAt: new Date(),
        createdAt: new Date(),
        deletedAt: null,
      };

      const refreshToken = RefreshToken.restore(dbProps);

      expect(refreshToken.id).toBe(dbProps.id);
      expect(refreshToken.userId).toBe(dbProps.userId);
      expect(refreshToken.createdAt).toBe(dbProps.createdAt);
    });
  });

  describe('isExpired', () => {
    it('should return false if expiresAt date is in the future', () => {
      const futureDate = new Date(Date.now() + 5000);

      const refreshToken = RefreshToken.create({
        ...createValidProps(),
        expiresAt: futureDate,
      });

      expect(refreshToken.isExpired()).toBe(false);
    });

    it('should return true if expiresAt date is in the past', () => {
      const pastDate = new Date(Date.now() - 5000);

      const refreshToken = RefreshToken.create({
        ...createValidProps(),
        expiresAt: pastDate,
      });

      expect(refreshToken.isExpired()).toBe(true);
    });
  });

  describe('revoke', () => {
    it('should successfully revoke an active token', () => {
      const refreshToken = RefreshToken.create(createValidProps());

      refreshToken.revoke();

      expect(refreshToken.isActive).toBe(false);
    });

    it('should throw a DomainError if trying to revoke an already revoked token', () => {
      const refreshToken = RefreshToken.create(createValidProps());
      refreshToken.revoke();

      expect(() => refreshToken.revoke()).toThrow(DomainError);
      expect(() => refreshToken.revoke()).toThrow(
        'Refresh token already revoked',
      );
    });
  });
});
