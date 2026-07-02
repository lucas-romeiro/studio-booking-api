import { IUserRepository } from '@/domain/user';

export const mockUserRepository: jest.Mocked<IUserRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  exists: jest.fn(),
};
