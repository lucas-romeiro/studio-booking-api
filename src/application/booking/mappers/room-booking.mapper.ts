import { RoomBooking } from '@/domain/booking';
import { RoomBookingResponseDto } from '../dtos/room-booking-response.dto';

export class RoomBookingMapper {
  static toResponse(booking: RoomBooking): RoomBookingResponseDto {
    return {
      id: booking.id,
      userId: booking.userId,
      roomId: booking.roomId,
      startTime: booking.timeSlot.startTime,
      endTime: booking.timeSlot.endTime,
      type: booking.type,
      totalPrice: booking.totalPrice.amount,
      currency: booking.totalPrice.currency,
      status: booking.status,
      createdAt: booking.createdAt,
    };
  }
}
