/* eslint-disable @typescript-eslint/unbound-method */
import { CancelRoomBookingUseCase } from '@/application/booking';
import { TokenPayload } from '@/domain/auth';
import {
  BookingStatus,
  RoomBookingNotFoundError,
  UnauthorizedBookingError,
} from '@/domain/booking';
import { UserRole } from '@/domain/user';
import { RoomBookingFactory } from '../../__factories__';
import { mockRoomBookingRepository } from '../../__mocks__';

describe('CancelRoomBookingUseCase', () => {
  let useCase: CancelRoomBookingUseCase;
  let currentUser: TokenPayload;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CancelRoomBookingUseCase(mockRoomBookingRepository);
    currentUser = {
      sub: crypto.randomUUID(),
      email: 'jhondoe@email.com',
      role: UserRole.ADMIN,
    };
  });

  describe('Cancel Flow', () => {
    it('should cancel a room booking succesfully', async () => {
      const booking = RoomBookingFactory.makeConfirmed();
      mockRoomBookingRepository.findById.mockResolvedValue(booking);

      await useCase.execute(booking.id, currentUser);

      expect(booking.status).toBe(BookingStatus.CANCELLED);
      expect(mockRoomBookingRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should cancel a room booking successfully as the owner (musician)', async () => {
      currentUser.role = UserRole.MUSICIAN;

      const booking = RoomBookingFactory.makeConfirmed({
        userId: currentUser.sub,
      });
      mockRoomBookingRepository.findById.mockResolvedValue(booking);

      await useCase.execute(booking.id, currentUser);

      expect(booking.status).toBe(BookingStatus.CANCELLED);
      expect(mockRoomBookingRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validation Flow', () => {
    it('should throw RoomBookingNotFoundError if booking does not exist', async () => {
      const invalidRoomBookingId = 'invalid-id';
      mockRoomBookingRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute(invalidRoomBookingId, currentUser),
      ).rejects.toBeInstanceOf(RoomBookingNotFoundError);
      await expect(useCase.execute('invalid-id', currentUser)).rejects.toThrow(
        `Room reservation ${invalidRoomBookingId} not found`,
      );
      expect(mockRoomBookingRepository.save).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedBookingError if user is not allowed', async () => {
      currentUser.role = UserRole.MUSICIAN;
      const booking = RoomBookingFactory.makeConfirmed();
      mockRoomBookingRepository.findById.mockResolvedValue(booking);

      await expect(
        useCase.execute(booking.id, currentUser),
      ).rejects.toBeInstanceOf(UnauthorizedBookingError);
      await expect(useCase.execute('invalid-id', currentUser)).rejects.toThrow(
        new UnauthorizedBookingError().message,
      );
      expect(mockRoomBookingRepository.save).not.toHaveBeenCalled();
    });
  });
});
