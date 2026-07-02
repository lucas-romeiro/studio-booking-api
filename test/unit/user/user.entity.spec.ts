import { DomainError } from '@/domain/shared';
import { Email, User, UserRole } from '@/domain/user';

describe('User entity', () => {
  const validProps = {
    name: 'John Doe',
    email: new Email('john_doe@email.com'),
    passwordHash: 'hash1234',
  };

  it('should create a user with default role musician', () => {
    const user = User.create(validProps);
    expect(user.role).toBe(UserRole.MUSICIAN);
    expect(user.id).toBeDefined();
  });

  it('should throw an error if name is less than 2 characters', () => {
    expect(() => User.create({ ...validProps, name: 'J' })).toThrow(
      DomainError,
    );
  });

  it('should promote an user to admin', () => {
    const user = User.create(validProps);
    user.promoteToAdmin();
    expect(user.role).toBe(UserRole.ADMIN);
  });

  it('should throw an error to promote admin twice', () => {
    const user = User.create({ ...validProps, role: UserRole.ADMIN });
    expect(() => user.promoteToAdmin()).toThrow(DomainError);
  });
});
