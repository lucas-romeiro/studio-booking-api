import { Injectable } from '@nestjs/common';
import { IRefreshTokenRepository, RefreshToken } from '@/domain/auth';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenOrmEntity } from '../entities/refresh-token.orm-entity';
import { IsNull, Repository } from 'typeorm';
import { RefreshTokenMapper } from '../mappers/refresh-token.mapper';

@Injectable()
export class RefreshTokenTypeOrmRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly repo: Repository<RefreshTokenOrmEntity>,
  ) {}

  async save(refreshToken: RefreshToken): Promise<void> {
    const orm = RefreshTokenMapper.toOrm(refreshToken);
    await this.repo.save(orm);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const orm = await this.repo.findOne({
      where: { token, deletedAt: IsNull() },
    });
    return orm ? RefreshTokenMapper.toDomain(orm) : null;
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.repo.softDelete({ userId });
  }
}
