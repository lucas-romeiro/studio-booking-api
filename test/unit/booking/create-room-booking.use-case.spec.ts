/* eslint-disable @typescript-eslint/unbound-method */
import {
  CreateRoomBookingDto,
  CreateRoomBookingUseCase,
} from '@/application/booking';
import { UserRole } from '@/domain/user';
import { TokenPayload } from '@/domain/auth';
import { RoomNotFoundError, RoomType } from '@/domain/room';
import { mockRoomBookingRepository, mockRoomRepository } from '../../__mocks__';
import { RoomBookingFactory, RoomFactory } from '../../__factories__';
import {
  RoomNotAvailableError,
  RoomTypeNotAllowedError,
} from '@/domain/booking';
import { futureDate } from '../../helpers';

describe('CreateRoomBookingUseCase', () => {
  let useCase: CreateRoomBookingUseCase;
  let dto: CreateRoomBookingDto;
  let currentUser: TokenPayload;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateRoomBookingUseCase(
      mockRoomBookingRepository,
      mockRoomRepository,
    );
    dto = {
      roomId: crypto.randomUUID(),
      startTime: futureDate(1).toISOString(),
      endTime: futureDate(3).toISOString(),
      type: RoomType.REHEARSAL,
    };
    currentUser = {
      sub: crypto.randomUUID(),
      email: 'johndoe@email.com',
      role: UserRole.MUSICIAN,
    };
  });

  describe('Creation Flow', () => {
    it('should create a reservation with pending status successfully', async () => {
      const room = RoomFactory.makeRehearsal({ id: dto.roomId });
      mockRoomRepository.findById.mockResolvedValue(room);
      mockRoomBookingRepository.findOverlapping.mockResolvedValue([]);
      mockRoomBookingRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(dto, currentUser);

      expect(result.roomId).toBe(dto.roomId);
      expect(result.userId).toBe(currentUser.sub);
      expect(mockRoomBookingRepository.findOverlapping).toHaveBeenCalledTimes(
        1,
      );
      expect(mockRoomBookingRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validation Flow', () => {
    it('should throw RoomNotFoundError if the room does not exist', async () => {
      mockRoomRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(dto, currentUser)).rejects.toBeInstanceOf(
        RoomNotFoundError,
      );
      await expect(useCase.execute(dto, currentUser)).rejects.toThrow(
        `Room ${dto.roomId} not found`,
      );
      expect(mockRoomBookingRepository.findOverlapping).not.toHaveBeenCalled();
      expect(mockRoomBookingRepository.save).not.toHaveBeenCalled();
    });

    it('should throw RoomTypeNotAllowedError if room does not support the booking type', async () => {
      const room = RoomFactory.makeRecording({ id: dto.roomId });
      mockRoomRepository.findById.mockResolvedValue(room);

      jest.spyOn(room, 'isAvailableFor').mockReturnValue(false);

      await expect(useCase.execute(dto, currentUser)).rejects.toBeInstanceOf(
        RoomTypeNotAllowedError,
      );
      await expect(useCase.execute(dto, currentUser)).rejects.toThrow(
        `Room not available for ${dto.type}`,
      );
      expect(mockRoomBookingRepository.save).not.toHaveBeenCalled();
    });

    it('should throw RoomNotAvailableError if there is an overlapping booking', async () => {
      const room = RoomFactory.makeRehearsal({ id: dto.roomId });
      mockRoomRepository.findById.mockResolvedValue(room);

      const conflictingBooking = RoomBookingFactory.make();
      mockRoomBookingRepository.findOverlapping.mockResolvedValue([
        conflictingBooking,
      ]);

      await expect(useCase.execute(dto, currentUser)).rejects.toBeInstanceOf(
        RoomNotAvailableError,
      );
      await expect(useCase.execute(dto, currentUser)).rejects.toThrow(
        'Room not available for the requested time',
      );
      expect(mockRoomBookingRepository.save).not.toHaveBeenCalled();
    });
  });
});
