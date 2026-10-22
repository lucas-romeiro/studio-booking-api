/* eslint-disable @typescript-eslint/unbound-method */
import { GetRoomAvailabilityUseCase } from '@/application/room';
import { RoomNotFoundError } from '@/domain/room';
import { RoomFactory } from '../../__factories__/room.factory';
import { mockRoomBookingRepository, mockRoomRepository } from '../../__mocks__';

describe('GetRoomAvailabilityUseCase', () => {
  let useCase: GetRoomAvailabilityUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetRoomAvailabilityUseCase(
      mockRoomRepository,
      mockRoomBookingRepository,
    );
  });

  describe('Availability Flow', () => {
    it('should return availability with free slots when there are no bookings', async () => {
      const room = RoomFactory.make();
      mockRoomRepository.findById.mockResolvedValue(room);
      mockRoomBookingRepository.findByRoomAndDate.mockResolvedValue([]);

      const result = await useCase.execute(room.id, '2026-11-03');

      expect(result.bookedSlots).toHaveLength(0);
      expect(result.availableSlots.length).toBeGreaterThan(0);
      expect(mockRoomRepository.findById).toHaveBeenCalledWith(room.id);
      expect(mockRoomBookingRepository.findByRoomAndDate).toHaveBeenCalledWith(
        room.id,
        new Date('2026-11-03'),
      );
    });

    it('should return empty slots if room does not operate on that day', async () => {
      const room = RoomFactory.make();
      mockRoomRepository.findById.mockResolvedValue(room);
      mockRoomBookingRepository.findByRoomAndDate.mockResolvedValue([]);

      const result = await useCase.execute(room.id, '2026-11-02');

      expect(result.availableSlots).toHaveLength(0);
      expect(result.bookedSlots).toHaveLength(0);
    });
  });

  describe('Validation Flow', () => {
    it('should throw RoomNotFoundError when room does not exist', async () => {
      const invalidId = 'id-invalido';
      mockRoomRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(invalidId, '2026-11-03')).rejects.toThrow(
        new RoomNotFoundError(invalidId),
      );

      expect(mockRoomRepository.findById).toHaveBeenCalledWith(invalidId);
      expect(
        mockRoomBookingRepository.findByRoomAndDate,
      ).not.toHaveBeenCalled();
    });
  });
});
