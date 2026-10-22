import { Injectable } from '@nestjs/common';
import {
  BookingStatus,
  IRoomBookingRepository,
  RoomBooking,
  SearchRoomBookingsFilter,
} from '@/domain/booking';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomBookingOrmEntity } from '../entities/room-booking.orm-entity';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { RoomBookingOrmMapper } from '../mappers/room-booking.mapper';

@Injectable()
export class RoomBookingTypeOrmRepository implements IRoomBookingRepository {
  constructor(
    @InjectRepository(RoomBookingOrmEntity)
    private readonly repo: Repository<RoomBookingOrmEntity>,
  ) {}

  async save(booking: RoomBooking): Promise<void> {
    await this.repo.save(RoomBookingOrmMapper.toOrm(booking));
  }

  async findById(id: string): Promise<RoomBooking | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? RoomBookingOrmMapper.toDomain(orm) : null;
  }

  async findAll(
    filter?: SearchRoomBookingsFilter,
  ): Promise<[RoomBooking[], number]> {
    const qb = this.repo.createQueryBuilder('booking');

    if (filter?.userId) {
      qb.andWhere('booking.userId = :userId', { userId: filter.userId });
    }
    if (filter?.roomId) {
      qb.andWhere('booking.roomId = :roomId', { roomId: filter.roomId });
    }
    if (filter?.status) {
      qb.andWhere('booking.status = :status', { status: filter.status });
    }
    if (filter?.startDate) {
      qb.andWhere('booking.startDate = :startDate', {
        startDate: filter.startDate,
      });
    }
    if (filter?.endDate) {
      qb.andWhere('booking.endDate = :endDate', { endDate: filter.endDate });
    }

    qb.orderBy(
      `booking.${filter?.orderBy ?? 'createdAt'}`,
      filter?.order ?? 'DESC',
    )
      .skip(filter?.skip ?? 0)
      .take(filter?.limit ?? 10);

    const [orms, total] = await qb.getManyAndCount();

    return [orms.map((b) => RoomBookingOrmMapper.toDomain(b)), total];
  }

  async findOverlapping(
    roomId: string,
    timeSlot: { startTime: Date; endTime: Date },
  ): Promise<RoomBooking[]> {
    const orms = await this.repo.find({
      where: {
        roomId,
        status: Not(BookingStatus.CANCELLED),
        startTime: LessThan(timeSlot.startTime),
        endTime: MoreThan(timeSlot.endTime),
      },
    });

    return orms.map((o) => RoomBookingOrmMapper.toDomain(o));
  }

  async exists(id: string): Promise<boolean> {
    return this.repo.existsBy({ id });
  }

  async findByRoomAndDate(roomId: string, date: Date): Promise<RoomBooking[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const orms = await this.repo.find({
      where: {
        roomId,
        status: Not(BookingStatus.CANCELLED),
        startTime: MoreThan(startOfDay),
        endTime: LessThan(endOfDay),
      },
    });

    return orms.map((o) => RoomBookingOrmMapper.toDomain(o));
  }
}
