import { BookingStatus, RoomBooking, TimeSlot } from '@/domain/booking';
import { Money, RoomType } from '@/domain/room';
import { DomainError } from '@/domain/shared';

describe('RoomBooking', () => {
  const createValidProps = () => {
    const startDate = new Date();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 2);

    return {
      userId: 'userId',
      roomId: 'roomId',
      timeSlot: new TimeSlot(startDate, endDate),
      type: RoomType.BOTH,
      totalPrice: new Money(80),
    };
  };

  describe('Creation Flow', () => {
    it('should create a valid RoomBooking successfully with PENDING status', () => {
      const props = createValidProps();

      const result = RoomBooking.create(props);

      expect(result.userId).toBe(props.userId);
      expect(result.roomId).toBe(props.roomId);
      expect(result.timeSlot).toEqual(props.timeSlot);
      expect(result.type).toBe(props.type);
      expect(result.totalPrice.amount).toBe(props.totalPrice.amount);
      expect(result.status).toBe(BookingStatus.PENDING);
      expect(result.isPending).toBe(true);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.deletedAt).toBeNull();
    });
  });

  describe('Restoration Flow', () => {
    it('should correctly reconstitute a room-booking instance with pre-existing database data', () => {
      const roomBookingProps = {
        ...createValidProps(),
        id: 'existing-uuid',
        status: BookingStatus.CANCELLED,
        createdAt: new Date(),
        deletedAt: null,
      };

      const result = RoomBooking.restore(roomBookingProps);

      expect(result.id).toBe(roomBookingProps.id);
      expect(result.userId).toBe(roomBookingProps.userId);
      expect(result.roomId).toBe(roomBookingProps.roomId);
      expect(result.timeSlot).toEqual(roomBookingProps.timeSlot);
      expect(result.type).toBe(roomBookingProps.type);
      expect(result.totalPrice.amount).toBe(roomBookingProps.totalPrice.amount);
      expect(result.status).toBe(roomBookingProps.status);
      expect(result.createdAt).toEqual(roomBookingProps.createdAt);
      expect(result.deletedAt).toBeNull();
    });
  });

  describe('Business Rules', () => {
    it('should successfully confirm a pending reservation', () => {
      const roomBooking = RoomBooking.create(createValidProps());
      roomBooking.confirm();

      expect(roomBooking.status).toBe(BookingStatus.CONFIRMED);
      expect(roomBooking.isConfirmed).toBe(true);
    });

    it('should throw a DomainError when trying to confirm a reservation that is not pending', () => {
      const roomBooking = RoomBooking.create(createValidProps());
      roomBooking.confirm();

      expect(() => roomBooking.confirm()).toThrow(DomainError);
      expect(() => roomBooking.confirm()).toThrow(
        'Only pending reservations can be confirmed',
      );
    });

    it('should successfully complete a confirmed reservation', () => {
      const roomBooking = RoomBooking.create(createValidProps());
      roomBooking.confirm();

      roomBooking.complete();

      expect(roomBooking.status).toBe(BookingStatus.COMPLETED);
    });

    it('should throw a DomainError when trying to complete a reservation that is not confirmed', () => {
      const roomBooking = RoomBooking.create(createValidProps());

      expect(() => roomBooking.complete()).toThrow(DomainError);
      expect(() => roomBooking.complete()).toThrow(
        'Only confirmed reservations can be completed',
      );
    });

    it('should successfully cancel a pending reservation', () => {
      const roomBooking = RoomBooking.create(createValidProps());

      roomBooking.cancel();

      expect(roomBooking.status).toBe(BookingStatus.CANCELLED);
      expect(roomBooking.isCancelled).toBe(true);
    });

    it('should successfully cancel a confirmed reservation', () => {
      const roomBooking = RoomBooking.create(createValidProps());
      roomBooking.confirm();

      roomBooking.cancel();

      expect(roomBooking.status).toBe(BookingStatus.CANCELLED);
    });

    it('should throw a DomainError when trying to cancel an already cancelled reservation', () => {
      const roomBooking = RoomBooking.create(createValidProps());
      roomBooking.cancel();

      expect(() => roomBooking.cancel()).toThrow(DomainError);
      expect(() => roomBooking.cancel()).toThrow(
        'The reservation is already cancelled',
      );
    });

    it('should throw a DomainError when trying to cancel an already completed reservation', () => {
      const roomBooking = RoomBooking.create(createValidProps());
      roomBooking.confirm();
      roomBooking.complete();

      expect(() => roomBooking.cancel()).toThrow(DomainError);
      expect(() => roomBooking.cancel()).toThrow(
        'A reservation that has already been completed cannot be cancelled',
      );
    });
  });
});
