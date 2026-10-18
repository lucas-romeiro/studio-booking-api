import { Inject, Injectable } from '@nestjs/common';
import {
  IRoomBookingRepository,
  ROOM_BOOKING_REPOSITORY,
  RoomBookingNotFoundError,
} from '@/domain/booking';
import { RoomBookingResponseDto } from '../dtos/room-booking-response.dto';
import { RoomBookingMapper } from '../mappers/room-booking.mapper';

@Injectable()
export class ConfirmeRoomBookingUseCase {
  constructor(
    @Inject(ROOM_BOOKING_REPOSITORY)
    private readonly roomBookingRepository: IRoomBookingRepository,
  ) {}

  async execute(id: string): Promise<RoomBookingResponseDto> {
    const booking = await this.roomBookingRepository.findById(id);

    if (!booking) {
      throw new RoomBookingNotFoundError(id);
    }

    booking.confirm();

    await this.roomBookingRepository.save(booking);

    return RoomBookingMapper.toResponse(booking);
  }
}
