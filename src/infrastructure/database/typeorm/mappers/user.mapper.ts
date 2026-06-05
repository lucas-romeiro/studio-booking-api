import { Email, User } from '@/domain/user';
import { UserOrmEntity } from '../entities/user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): User {
    return User.restore({
      id: orm.id,
      name: orm.name,
      email: new Email(orm.email),
      passwordHash: orm.passwordHash,
      role: orm.role,
      createdAt: orm.createdAt,
      deletedAt: orm.deletedAt,
    });
  }

  static toOrm(domain: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.email = domain.email.toString();
    orm.passwordHash = domain.passwordHash;
    orm.role = domain.role;
    orm.createdAt = domain.createdAt;
    return orm;
  }
}
