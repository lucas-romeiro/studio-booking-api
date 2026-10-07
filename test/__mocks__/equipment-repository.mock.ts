import { IEquipmentRepository } from '@/domain/equipment';

export const mockEquipmentRepository: jest.Mocked<IEquipmentRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn().mockResolvedValue([[], 0]),
  exists: jest.fn(),
};
