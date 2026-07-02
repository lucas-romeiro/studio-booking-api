import { RefreshToken } from '../../src/domain/auth';

interface RefreshTokenFactoryProps {
  id?: string;
  userId?: string;
  token?: string;
  expiresAt?: Date;
  createdAt?: Date;
  deletedAt?: Date | null;
}

export class RefreshTokenFactory {
  static make(override: RefreshTokenFactoryProps = {}): RefreshToken {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return RefreshToken.restore({
      id: override.id ?? crypto.randomUUID(),
      userId: override.userId ?? crypto.randomUUID(),
      token: override.token ?? 'valid_refresh_token',
      expiresAt: override.expiresAt ?? expiresAt,
      createdAt: override.createdAt ?? new Date(),
      deletedAt: override.deletedAt ?? null,
    });
  }

  static makeExpired(override: RefreshTokenFactoryProps = {}): RefreshToken {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() - 1);
    return RefreshTokenFactory.make({ ...override, expiresAt });
  }

  static makeRevoked(override: RefreshTokenFactoryProps = {}): RefreshToken {
    return RefreshTokenFactory.make({ ...override, deletedAt: new Date() });
  }
}
