import { BookingStatus, RoomBooking, TimeSlot } from '@/domain/booking';
import { Money, RoomType } from '@/domain/room';

interface RoomBookingFactoryProps {
  id?: string;
  userId?: string;
  roomId?: string;
  status?: BookingStatus;
  createdAt?: Date;
  deletedAt?: Date | null;
}

const futureDate = (hoursFromNow: number): Date => {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow);
  return date;
};

export class RoomBookingFactory {
  static make(override: RoomBookingFactoryProps = {}): RoomBooking {
    return RoomBooking.restore({
      id: override.id ?? crypto.randomUUID(),
      userId: override.userId ?? crypto.randomUUID(),
      roomId: override.roomId ?? crypto.randomUUID(),
      timeSlot: new TimeSlot(futureDate(1), futureDate(3)),
      type: RoomType.REHEARSAL,
      totalPrice: new Money(100),
      status: override.status ?? BookingStatus.PENDING,
      createdAt: override.createdAt ?? new Date(),
      deletedAt: override.deletedAt ?? null,
    });
  }

  static makeConfirmed(override: RoomBookingFactoryProps = {}): RoomBooking {
    return RoomBookingFactory.make({
      ...override,
      status: BookingStatus.CONFIRMED,
    });
  }

  static makeCancelled(override: RoomBookingFactoryProps = {}): RoomBooking {
    return RoomBookingFactory.make({
      ...override,
      status: BookingStatus.CANCELLED,
    });
  }
}
