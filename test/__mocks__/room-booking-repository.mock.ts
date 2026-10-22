import { IRoomBookingRepository } from '@/domain/booking';

export const mockRoomBookingRepository: jest.Mocked<IRoomBookingRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn().mockResolvedValue([[], 0]),
  findOverlapping: jest.fn().mockResolvedValue([]),
  exists: jest.fn(),
  findByRoomAndDate: jest.fn(),
};
