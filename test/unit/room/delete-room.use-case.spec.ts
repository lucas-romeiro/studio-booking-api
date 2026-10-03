/* eslint-disable @typescript-eslint/unbound-method */
import { DeleteRoomUseCase } from '@/application/room';
import { mockRoomRepository } from '../../__mocks__';
import { RoomFactory } from '../../__factories__';
import { RoomAlreadyInactiveError, RoomNotFoundError } from '@/domain/room';

describe('DeleteRoomUseCase', () => {
  let useCase: DeleteRoomUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteRoomUseCase(mockRoomRepository);
  });

  describe('Delete Flow', () => {
    it('deactivate the room successfully', async () => {
      const room = RoomFactory.make();
      mockRoomRepository.findById.mockResolvedValue(room);
      mockRoomRepository.save.mockResolvedValue(undefined);

      await useCase.execute(room.id);

      expect(room.isActive).toBe(false);
      expect(mockRoomRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw RoomNotFoundError if room does not exists', async () => {
      const invalidId = 'invalid-id';
      mockRoomRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(invalidId)).rejects.toThrow(
        RoomNotFoundError,
      );

      expect(mockRoomRepository.findById).toHaveBeenCalledWith(invalidId);
      expect(mockRoomRepository.save).not.toHaveBeenCalled();
    });

    it('should throw RoomAlreadyInactiveError if room is already inactive', async () => {
      const room = RoomFactory.make({ deletedAt: new Date() });
      mockRoomRepository.findById.mockResolvedValue(room);

      await expect(useCase.execute(room.id)).rejects.toThrow(
        RoomAlreadyInactiveError,
      );
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(room.id);
      expect(mockRoomRepository.save).not.toHaveBeenCalled();
    });
  });
});
