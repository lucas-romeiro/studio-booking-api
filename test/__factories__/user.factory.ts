import { Email, User, UserRole } from '@/domain/user';

interface UserFactoryProps {
  id?: string;
  name?: string;
  email?: string;
  passwordHash?: string;
  role?: UserRole;
  createdAt?: Date;
  deletedAt?: Date | null;
}

export class UserFactory {
  static make(override: UserFactoryProps = {}): User {
    return User.restore({
      id: override.id ?? crypto.randomUUID(),
      name: override.name ?? 'Jhon Doe',
      email: new Email(override.email ?? 'jhon_doe@email.com'),
      passwordHash: override.passwordHash ?? 'hashed_password',
      role: override.role ?? UserRole.MUSICIAN,
      createdAt: override.createdAt ?? new Date(),
      deletedAt: override.deletedAt ?? null,
    });
  }

  static makeAdmin(override: UserFactoryProps = {}): User {
    return UserFactory.make({ ...override, role: UserRole.ADMIN });
  }

  static makeMany(count: number, override: UserFactoryProps = {}): User[] {
    return Array.from({ length: count }, (_, i) =>
      UserFactory.make({
        ...override,
        email: override.email ?? `user${i}@email.com`,
      }),
    );
  }
}
