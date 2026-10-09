import { Money, RoomType } from '../../room';
import { BaseEntity, DomainError } from '../../shared';
import { BookingStatus } from '../value-objects/booking-status.vo';
import { TimeSlot } from '../value-objects/time-slot.vo';

interface CreateRoomBookingProps {
  userId: string;
  roomId: string;
  timeSlot: TimeSlot;
  type: RoomType;
  totalPrice: Money;
}

export class RoomBooking extends BaseEntity {
  private constructor(
    id: string,
    public readonly userId: string,
    public readonly roomId: string,
    public readonly timeSlot: TimeSlot,
    public readonly type: RoomType,
    public readonly totalPrice: Money,
    private _status: BookingStatus,
    createdAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, deletedAt);
  }

  static create(props: CreateRoomBookingProps): RoomBooking {
    return new RoomBooking(
      crypto.randomUUID(),
      props.userId,
      props.roomId,
      props.timeSlot,
      props.type,
      props.totalPrice,
      BookingStatus.PENDING,
      new Date(),
      null,
    );
  }

  static restore(props: {
    id: string;
    userId: string;
    roomId: string;
    timeSlot: TimeSlot;
    type: RoomType;
    totalPrice: Money;
    status: BookingStatus;
    createdAt: Date;
    deletedAt: Date | null;
  }): RoomBooking {
    return new RoomBooking(
      props.id,
      props.userId,
      props.roomId,
      props.timeSlot,
      props.type,
      props.totalPrice,
      props.status,
      props.createdAt,
      props.deletedAt,
    );
  }

  confirm(): void {
    if (this._status !== BookingStatus.PENDING) {
      throw new DomainError('Only pending reservations can be confirmed');
    }

    this._status = BookingStatus.CONFIRMED;
  }

  cancel(): void {
    if (this._status === BookingStatus.CANCELLED) {
      throw new DomainError('The reservation is already cancelled');
    }

    if (this._status === BookingStatus.COMPLETED) {
      throw new DomainError(
        'A reservation that has already been completed cannot be cancelled',
      );
    }

    this._status = BookingStatus.CANCELLED;
  }

  complete(): void {
    if (this._status !== BookingStatus.CONFIRMED) {
      throw new DomainError('Only confirmed reservations can be completed');
    }

    this._status = BookingStatus.COMPLETED;
  }

  get status(): BookingStatus {
    return this._status;
  }

  get isPending(): boolean {
    return this._status === BookingStatus.PENDING;
  }

  get isConfirmed(): boolean {
    return this._status === BookingStatus.CONFIRMED;
  }

  get isCancelled(): boolean {
    return this._status === BookingStatus.CANCELLED;
  }
}
