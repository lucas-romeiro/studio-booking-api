import { IRoomRepository } from '@/domain/room';

export const mockRoomRepository: jest.Mocked<IRoomRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  exists: jest.fn(),
  delete: jest.fn(),
};
