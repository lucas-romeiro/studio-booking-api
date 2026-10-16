import { Inject, Injectable } from '@nestjs/common';
import {
  IRoomBookingRepository,
  ROOM_BOOKING_REPOSITORY,
  RoomBooking,
  RoomNotAvailableError,
  RoomTypeNotAllowedError,
  TimeSlot,
} from '@/domain/booking';
import {
  IRoomRepository,
  ROOM_REPOSITORY,
  RoomNotFoundError,
} from '@/domain/room';
import { RoomBookingResponseDto } from '../dtos/room-booking-response.dto';
import { CreateRoomBookingDto } from '../dtos/create-room-booking.dto';
import { TokenPayload } from '@/domain/auth';
import { RoomBookingMapper } from '../mappers/room-booking.mapper';

@Injectable()
export class CreateRoomBookingUseCase {
  constructor(
    @Inject(ROOM_BOOKING_REPOSITORY)
    private readonly roomBookingRepository: IRoomBookingRepository,
    @Inject(ROOM_REPOSITORY) private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(
    dto: CreateRoomBookingDto,
    currentUser: TokenPayload,
  ): Promise<RoomBookingResponseDto> {
    const room = await this.roomRepository.findById(dto.roomId);

    if (!room) {
      throw new RoomNotFoundError(dto.roomId);
    }

    if (!room.isAvailableFor(dto.type)) {
      throw new RoomTypeNotAllowedError(dto.type);
    }

    const timeSlot = new TimeSlot(
      new Date(dto.startTime),
      new Date(dto.endTime),
    );

    const overlapping = await this.roomBookingRepository.findOverlapping(
      dto.roomId,
      { startTime: timeSlot.startTime, endTime: timeSlot.endTime },
    );

    if (overlapping.length > 0) {
      throw new RoomNotAvailableError();
    }

    const hours = timeSlot.getHours();
    const totalPrice = room.calculatePrice(hours);

    const booking = RoomBooking.create({
      userId: currentUser.sub,
      roomId: dto.roomId,
      timeSlot,
      type: dto.type,
      totalPrice,
    });

    await this.roomBookingRepository.save(booking);

    return RoomBookingMapper.toResponse(booking);
  }
}
