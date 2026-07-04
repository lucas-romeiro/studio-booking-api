import { CreateUserDto, CreateUserUseCase } from '@/application/user';
import { UserAlreadyExistsError, UserRole } from '@/domain/user';
import { InMemoryUserRepository } from '../../__spies__';
import { UserFactory } from '../../__factories__';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockedBcrypt = jest.mocked(bcrypt);

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let repo: InMemoryUserRepository;
  let defaultDto: CreateUserDto;

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new InMemoryUserRepository();
    useCase = new CreateUserUseCase(repo);

    defaultDto = {
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: 'Password1!',
      role: UserRole.MUSICIAN,
    };

    mockedBcrypt.hash.mockImplementation(() => 'hashed_password');
  });

  describe('Success Flow', () => {
    it('should create a user with correctly assigned properties', async () => {
      const result = await useCase.execute(defaultDto);

      expect(result.id).toBeDefined();
      expect(result.email).toBe(defaultDto.email);
      expect(result.role).toBe(UserRole.MUSICIAN);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(defaultDto.password, 10);
    });

    it('should successfully persist the user in the repository data store', async () => {
      await useCase.execute(defaultDto);

      const saved = await repo.findByEmail(defaultDto.email);
      expect(saved).not.toBeNull();
      expect(saved?.name).toBe(defaultDto.name);
      expect(saved?.passwordHash).toBe('hashed_password');
    });

    it('should allow creating multiple users if emails are different', async () => {
      await useCase.execute(defaultDto);
      await useCase.execute({ ...defaultDto, email: 'other_user@email.com' });

      expect(repo.users).toHaveLength(2);
    });
  });

  describe('Failure Flow', () => {
    it('should throw UserAlreadyExistsError if email is already in use', async () => {
      const existingUser = UserFactory.make({ email: defaultDto.email });
      repo.users.push(existingUser);

      await expect(useCase.execute(defaultDto)).rejects.toThrow(
        UserAlreadyExistsError,
      );

      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      expect(repo.users).toHaveLength(1);
    });
  });
});
