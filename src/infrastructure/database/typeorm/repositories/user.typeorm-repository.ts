import { IUserRepository, User } from '@/domain/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const orm = UserMapper.toOrm(user);
    await this.repo.save(orm);
  }

  async findById(id: string): Promise<User | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.repo.findOneBy({ email });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async exists(email: string): Promise<boolean> {
    return this.repo.existsBy({ email });
  }
}
