/* eslint-disable @typescript-eslint/unbound-method */
import { GetRoomUseCase } from '@/application/room';
import { RoomNotFoundError } from '@/domain/room';
import { RoomFactory } from '../../__factories__';
import { mockRoomRepository } from '../../__mocks__';

describe('GetRoomUseCase', () => {
  let useCase: GetRoomUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetRoomUseCase(mockRoomRepository);
  });

  describe('Find Flow', () => {
    it('should return a room response dto when room exists', async () => {
      const room = RoomFactory.make({ name: 'Room D' });
      mockRoomRepository.findById.mockResolvedValue(room);

      const result = await useCase.execute(room.id);

      expect(mockRoomRepository.findById).toHaveBeenCalledWith(room.id);
      expect(mockRoomRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(room.id);
      expect(result.name).toBe('Room D');
    });

    it('should throw RoomNotFoundError when room does not exist', async () => {
      const invalidId = 'invalid-Id';
      mockRoomRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(invalidId)).rejects.toThrow(
        RoomNotFoundError,
      );
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(invalidId);
    });
  });
});
