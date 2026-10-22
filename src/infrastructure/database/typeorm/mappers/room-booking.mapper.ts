import { RoomBooking, TimeSlot } from '@/domain/booking';
import { Money } from '@/domain/room';
import { RoomBookingOrmEntity } from '../entities/room-booking.orm-entity';

export class RoomBookingOrmMapper {
  static toDomain(orm: RoomBookingOrmEntity): RoomBooking {
    return RoomBooking.restore({
      id: orm.id,
      userId: orm.userId,
      roomId: orm.roomId,
      timeSlot: new TimeSlot(orm.startTime, orm.endTime),
      type: orm.type,
      totalPrice: new Money(Number(orm.totalPrice), orm.currency),
      status: orm.status,
      createdAt: orm.createdAt,
      deletedAt: orm.deletedAt,
    });
  }

  static toOrm(domain: RoomBooking): RoomBookingOrmEntity {
    const orm = new RoomBookingOrmEntity();
    orm.id = domain.id;
    orm.userId = domain.userId;
    orm.roomId = domain.roomId;
    orm.startTime = domain.timeSlot.startTime;
    orm.endTime = domain.timeSlot.endTime;
    orm.type = domain.type;
    orm.totalPrice = domain.totalPrice.amount;
    orm.currency = domain.totalPrice.currency;
    orm.status = domain.status;
    orm.createdAt = domain.createdAt;
    orm.deletedAt = domain.deletedAt;
    return orm;
  }
}
