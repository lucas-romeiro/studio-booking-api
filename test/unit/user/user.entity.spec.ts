import { DomainError } from '@/domain/shared';
import { Email, User, UserRole } from '@/domain/user';

describe('User Entity', () => {
  const createValidProps = () => ({
    name: 'John Doe',
    email: new Email('john_doe@email.com'),
    passwordHash: 'hash1234',
  });

  describe('create', () => {
    it('should create a user with default role MUSICIAN and auto-generated properties', () => {
      const props = createValidProps();
      const user = User.create(props);

      expect(user.id).toBeDefined();
      expect(user.role).toBe(UserRole.MUSICIAN);
      expect(user.isAdmin).toBe(false);
      expect(user.name).toBe(props.name);
    });

    it('should trim whitespace from the user name during creation', () => {
      const props = { ...createValidProps(), name: '   Jane Doe   ' };

      const user = User.create(props);

      expect(user.name).toBe('Jane Doe');
    });

    it('should throw a DomainError if name is less than 2 characters after trimming', () => {
      const props = { ...createValidProps(), name: ' J ' };

      expect(() => User.create(props)).toThrow(DomainError);
      expect(() => User.create(props)).toThrow(
        'Name must have 2 caracters at least',
      );
    });
  });

  describe('restore', () => {
    it('should correctly reconstitute a user instance with pre-existing database data', () => {
      const dbProps = {
        id: 'existing-uuid',
        name: 'Admin User',
        email: new Email('admin@email.com'),
        passwordHash: 'hashed_pass',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        deletedAt: null,
      };

      const user = User.restore(dbProps);

      expect(user.id).toBe(dbProps.id);
      expect(user.role).toBe(UserRole.ADMIN);
      expect(user.isAdmin).toBe(true);
    });
  });

  describe('promoteToAdmin', () => {
    it('should successfully change the user role to ADMIN', () => {
      const user = User.create(createValidProps());

      expect(user.isAdmin).toBe(false);

      user.promoteToAdmin();

      expect(user.role).toBe(UserRole.ADMIN);
      expect(user.isAdmin).toBe(true);
    });

    it('should throw a DomainError if trying to promote a user who is already an admin', () => {
      const adminUser = User.restore({
        id: 'any-id',
        name: 'John Admin',
        email: new Email('admin@email.com'),
        passwordHash: 'hash',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        deletedAt: null,
      });

      expect(() => adminUser.promoteToAdmin()).toThrow(DomainError);
      expect(() => adminUser.promoteToAdmin()).toThrow(
        'User is already an Admin',
      );
    });
  });
});
