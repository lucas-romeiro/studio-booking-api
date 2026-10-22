import { Column, Entity } from 'typeorm';
import { BaseOrmEntity } from './base.orm-entity';
import { RoomType } from '@/domain/room';
import { BookingStatus } from '../../../../domain/booking';

@Entity('room_bookings')
export class RoomBookingOrmEntity extends BaseOrmEntity {
  @Column()
  userId!: string;

  @Column()
  roomId!: string;

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;

  @Column({ type: 'enum', enum: RoomType })
  type!: RoomType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({ default: 'BRL' })
  currency!: string;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status!: BookingStatus;
}
