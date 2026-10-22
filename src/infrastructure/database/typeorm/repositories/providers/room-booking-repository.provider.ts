import { Provider } from '@nestjs/common';
import { ROOM_BOOKING_REPOSITORY } from '@/domain/booking';
import { RoomBookingTypeOrmRepository } from '../room-booking.typeorm-repository';

export const roomBookingRepositoryProvider: Provider = {
  provide: ROOM_BOOKING_REPOSITORY,
  useClass: RoomBookingTypeOrmRepository,
};
