import { Money, OperatingHours, Room, RoomType } from '@/domain/room';
import { DomainError } from '@/domain/shared';

describe('Room Entity', () => {
  const createValidProps = () => ({
    name: 'Studio A',
    description: 'Main recording studio',
    type: RoomType.RECORDING,
    capacity: 5,
    pricePerHour: new Money(100),
    operatingHours: new OperatingHours({
      monday: { open: '08:00', close: '22:00' },
    }),
  });

  describe('Create', () => {
    it('should create a room entity successfully', () => {
      const props = createValidProps();
      const room = Room.create(props);

      expect(room.id).toBeDefined();
      expect(room.name).toBe(props.name);
      expect(room.description).toBe(props.description);
      expect(room.type).toBe(props.type);
      expect(room.capacity).toBe(props.capacity);
      expect(room.pricePerHour).toBe(props.pricePerHour);
      expect(room.operatingHours).toBe(props.operatingHours);
      expect(room.createdAt).toBeInstanceOf(Date);
      expect(room.deletedAt).toBeNull();
    });

    it.each(['S', '   ', ''])(
      'should throw a DomainError if name is invalid: "%s"',
      (invalidName) => {
        const props = { ...createValidProps(), name: invalidName };

        expect(() => Room.create(props)).toThrow(
          new DomainError('The room name must be at least 2 characters long.'),
        );
      },
    );

    it('should throw a DomainError if capacity is less than 1', () => {
      const props = { ...createValidProps(), capacity: 0 };

      expect(() => Room.create(props)).toThrow(
        new DomainError('Capacity must be at least 1'),
      );
    });
  });

  describe('Business Rules & Helpers', () => {
    it('should return true for availability when room type matches or is BOTH', () => {
      const roomRecording = Room.create({
        ...createValidProps(),
        type: RoomType.RECORDING,
      });
      const roomBoth = Room.create({
        ...createValidProps(),
        type: RoomType.BOTH,
      });

      expect(roomRecording.isAvailableFor(RoomType.RECORDING)).toBe(true);
      expect(roomRecording.isAvailableFor(RoomType.REHEARSAL)).toBe(false);
      expect(roomBoth.isAvailableFor(RoomType.RECORDING)).toBe(true);
      expect(roomBoth.isAvailableFor(RoomType.REHEARSAL)).toBe(true);
    });

    it('should calculate total price correctly based on hours', () => {
      const room = Room.create(createValidProps());
      const total = room.calculatePrice(3);

      expect(total.amount).toBe(300);
    });

    it('should update room properties successfully', () => {
      const room = Room.create(createValidProps());

      room.update({ name: 'Studio Updated', capacity: 10 });

      expect(room.name).toBe('Studio Updated');
      expect(room.capacity).toBe(10);
    });

    it('should throw a DomainError when updating with an invalid name or capacity', () => {
      const room = Room.create(createValidProps());

      expect(() => room.update({ name: 'X' })).toThrow(
        new DomainError('Name must have at least 2 characters'),
      );
      expect(() => room.update({ capacity: 0 })).toThrow(
        new DomainError('Capacity must be at least 1'),
      );
    });
  });

  describe('Restore', () => {
    it('should correctly reconstitute a room instance from database data', () => {
      const roomProps = {
        id: 'room-uuid',
        name: 'Studio B',
        description: 'Rehearsal Room',
        type: RoomType.RECORDING,
        capacity: 8,
        pricePerHour: new Money(150),
        operatingHours: new OperatingHours({
          monday: { open: '09:00', close: '18:00' },
        }),
        createdAt: new Date('2026-01-01'),
        deletedAt: null,
      };

      const room = Room.restore(roomProps);

      expect(room.id).toBe(roomProps.id);
      expect(room.name).toBe(roomProps.name);
      expect(room.capacity).toBe(roomProps.capacity);
      expect(room.createdAt).toEqual(roomProps.createdAt);
    });
  });
});
