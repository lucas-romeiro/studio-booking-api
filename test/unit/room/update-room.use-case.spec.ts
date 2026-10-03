import { UpdateRoomUseCase } from '@/application/room';
import { mockRoomRepository } from '../../__mocks__';
import { RoomFactory } from '../../__factories__';
import { RoomNotFoundError } from '@/domain/room';

describe('UpdateRoomUseCase', () => {
  let useCase: UpdateRoomUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateRoomUseCase(mockRoomRepository);
  });

  describe('Update Flow', () => {
    it('should update room data', async () => {
      const room = RoomFactory.make({ name: 'Room A', capacity: 8 });
      mockRoomRepository.findById.mockResolvedValue(room);
      mockRoomRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(room.id, {
        name: 'Room B',
        capacity: 12,
      });

      expect(result.name).toBe('Room B');
      expect(result.capacity).toBe(12);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRoomRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Room B',
          capacity: 12,
        }),
      );
    });

    it('should throw RoomNotFoundError if room does not exist', async () => {
      const invalidId = 'invalid-id';
      mockRoomRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute(invalidId, { name: 'Room B' }),
      ).rejects.toThrow(RoomNotFoundError);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(invalidId);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRoomRepository.save).not.toHaveBeenCalled();
    });
  });
});
