/* eslint-disable @typescript-eslint/unbound-method */
import { GetMeUseCase } from '@/application/auth';
import { mockUserRepository } from '../../__mocks__';
import { UserFactory } from '../../__factories__';
import { UserNotFoundError } from '@/domain/user';

describe('GetMeUseCase', () => {
  let useCase: GetMeUseCase;
  let user: ReturnType<typeof UserFactory.make>;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetMeUseCase(mockUserRepository);
    user = UserFactory.make();
  });

  describe('Success Flow', () => {
    it('should return a userDto if user exists', async () => {
      mockUserRepository.findById.mockResolvedValue(user);

      const result = await useCase.execute(user.id);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(user.id);
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        id: user.id,
        name: user.name,
        email: user.email.toString(),
        role: user.role,
        createdAt: user.createdAt,
      });
    });
  });

  describe('Failure Flow', () => {
    it('should throw UserNotFoundError if user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(user.id)).rejects.toThrow(
        new UserNotFoundError(user.id),
      );
      expect(mockUserRepository.findById).toHaveBeenCalledWith(user.id);
    });
  });
});
