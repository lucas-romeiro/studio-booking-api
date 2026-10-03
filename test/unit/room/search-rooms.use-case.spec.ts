/* eslint-disable @typescript-eslint/unbound-method */
import { SearchRoomsUseCase } from '@/application/room';
import { RoomFactory } from '../../__factories__';
import { mockRoomRepository } from '../../__mocks__';

describe('SearchRoomUseCase', () => {
  let useCase: SearchRoomsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SearchRoomsUseCase(mockRoomRepository);
  });

  describe('Search Flow', () => {
    it('should return an array of room response dtos when rooms are found with filters', async () => {
      const room = RoomFactory.make({ capacity: 8 });
      const filter = { minCapacity: 8 };
      mockRoomRepository.findAll.mockResolvedValue([room]);

      const result = await useCase.execute(filter);

      expect(mockRoomRepository.findAll).toHaveBeenCalledWith(filter);
      expect(mockRoomRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(room.name);
      expect(result[0].capacity).toBe(8);
    });

    it('should return an empty array when no rooms are found', async () => {
      mockRoomRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(mockRoomRepository.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([]);
    });
  });
});
