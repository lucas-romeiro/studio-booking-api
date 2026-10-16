import { IEquipmentRentalRepository } from '@/domain/booking';

export const mockEquipmentRentalRepository: jest.Mocked<IEquipmentRentalRepository> =
  {
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn().mockResolvedValue([[], 0]),
    findActiveByEquipmentId: jest.fn().mockResolvedValue([]),
    exists: jest.fn(),
  };
