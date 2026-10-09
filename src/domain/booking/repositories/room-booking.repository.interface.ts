import { PaginationDto } from '@/shared';
import { BookingStatus } from '../value-objects/booking-status.vo';
import { RoomBooking } from '../entities/room-booking.entity';

export const ROOM_BOOKING_REPOSITORY = Symbol('IRoomBookingRepository');

export interface SearchRoomBookingsFilter extends PaginationDto {
  userId?: string;
  roomId?: string;
  status?: BookingStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface IRoomBookingRepository {
  save(booking: RoomBooking): Promise<void>;
  findById(id: string): Promise<RoomBooking | null>;
  findAll(filter?: SearchRoomBookingsFilter): Promise<[RoomBooking[], number]>;
  findOverlapping(
    roomId: string,
    timeSlot: { startTime: Date; endTime: Date },
  ): Promise<RoomBooking[]>;
  exists(id: string): Promise<boolean>;
}
