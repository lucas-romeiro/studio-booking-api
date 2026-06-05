import { BaseEntity } from '../../shared/entities';
import { DomainError } from '../../shared/errors';
import { Email } from '../value-objects/email.vo';
import { UserRole } from '../value-objects/user-role.vo';

interface CreateUserProps {
  name: string;
  email: Email;
  passwordHash: string;
  role?: UserRole;
}

export class User extends BaseEntity {
  private constructor(
    id: string,
    public readonly name: string,
    public readonly email: Email,
    public readonly passwordHash: string,
    private _role: UserRole,
    createdAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, deletedAt);
  }

  static create(props: CreateUserProps): User {
    if (!props.name || props.name.trim().length < 2) {
      throw new DomainError('Name must have 2 caracters at least');
    }

    return new User(
      crypto.randomUUID(),
      props.name.trim(),
      props.email,
      props.passwordHash,
      props.role ?? UserRole.MUSICIAN,
      new Date(),
      null,
    );
  }

  static restore(props: {
    id: string;
    name: string;
    email: Email;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    deletedAt: Date | null;
  }): User {
    return new User(
      props.id,
      props.name,
      props.email,
      props.passwordHash,
      props.role,
      props.createdAt,
      props.deletedAt,
    );
  }

  promoteToAdmin(): void {
    if (this._role === UserRole.ADMIN) {
      throw new DomainError('User is already an Admin');
    }
    this._role = UserRole.ADMIN;
  }

  get role(): UserRole {
    return this._role;
  }

  get isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }
}
