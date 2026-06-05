import { CreateUserDto, CreateUserUseCase } from '@/application/user';
import { UserAlreadyExistsError, UserRole } from '@/domain/user';
import { InMemoryUserRepository } from '../../__spies__';

const dto: CreateUserDto = {
  name: 'Jhon Doe',
  email: 'john_doe@email.com',
  password: 'Password1!',
};

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let repo: InMemoryUserRepository;

  beforeEach(() => {
    repo = new InMemoryUserRepository();
    useCase = new CreateUserUseCase(repo);
  });

  it('should create a user with default musician role', async () => {
    const result = await useCase.execute(dto);

    expect(result.role).toBe(UserRole.MUSICIAN);
    expect(result.email).toBe(dto.email);
    expect(result.id).toBeDefined();
  });

  it('should persist the user in the repository', async () => {
    await useCase.execute(dto);

    const saved = await repo.findByEmail(dto.email);
    expect(saved).not.toBeNull();
    expect(saved?.name).toBe(dto.name);
  });

  it('should not store the password in plain text', async () => {
    await useCase.execute(dto);

    const saved = await repo.findByEmail(dto.email);
    expect(saved?.passwordHash).not.toBe(dto.password);
  });

  it('should throw an error if email is duplicated', async () => {
    await useCase.execute(dto);

    await expect(useCase.execute(dto)).rejects.toThrow(UserAlreadyExistsError);
    expect(repo.users).toHaveLength(1);
  });

  it('should create multiple users with different emails', async () => {
    await useCase.execute(dto);
    await useCase.execute({ ...dto, email: 'outro@email.com' });

    expect(repo.users).toHaveLength(2);
  });
});
