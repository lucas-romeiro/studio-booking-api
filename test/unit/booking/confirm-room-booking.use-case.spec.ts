/* eslint-disable @typescript-eslint/unbound-method */
import { ConfirmeRoomBookingUseCase } from '@/application/booking';
import { mockRoomBookingRepository } from '../../__mocks__';
import { RoomBookingFactory } from '../../__factories__';
import { BookingStatus, RoomBookingNotFoundError } from '@/domain/booking';

describe('ConfirmRoomBookingUseCase', () => {
  let useCase: ConfirmeRoomBookingUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ConfirmeRoomBookingUseCase(mockRoomBookingRepository);
  });

  describe('Confirmation Flow', () => {
    it('should confirm a room booking successfully', async () => {
      const booking = RoomBookingFactory.make();
      mockRoomBookingRepository.findById.mockResolvedValue(booking);

      const result = await useCase.execute(booking.id);

      expect(result.status).toBe(BookingStatus.CONFIRMED);
      expect(mockRoomBookingRepository.findById).toHaveBeenCalledWith(
        booking.id,
      );
      expect(mockRoomBookingRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRoomBookingRepository.save).toHaveBeenCalledWith(booking);
    });
  });

  describe('Validation Flow', () => {
    it('should throw a RoomBookingNotFoundError if booking does not exists', async () => {
      const invalidId = 'invalid-id';
      mockRoomBookingRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(invalidId)).rejects.toThrow(
        RoomBookingNotFoundError,
      );
      expect(mockRoomBookingRepository.findById).toHaveBeenCalledWith(
        invalidId,
      );
      expect(mockRoomBookingRepository.save).not.toHaveBeenCalled();
    });
  });
});
