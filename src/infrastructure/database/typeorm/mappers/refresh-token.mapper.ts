import { RefreshToken } from '@/domain/auth';
import { RefreshTokenOrmEntity } from '../entities/refresh-token.orm-entity';

export class RefreshTokenMapper {
  static toDomain(orm: RefreshTokenOrmEntity): RefreshToken {
    return RefreshToken.restore({
      id: orm.id,
      userId: orm.userId,
      token: orm.token,
      expiresAt: orm.expiresAt,
      createdAt: orm.createdAt,
      deletedAt: orm.deletedAt,
    });
  }

  static toOrm(domain: RefreshToken): RefreshTokenOrmEntity {
    const orm = new RefreshTokenOrmEntity();
    orm.id = domain.id;
    orm.userId = domain.userId;
    orm.token = domain.token;
    orm.expiresAt = domain.expiresAt;
    orm.createdAt = domain.createdAt;
    orm.deletedAt = domain.deletedAt;
    return orm;
  }
}
