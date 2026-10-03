import { Money, OperatingHours, Room, RoomType } from '@/domain/room';

interface RoomFactoryProps {
  id?: string;
  name?: string;
  type?: RoomType;
  capacity?: number;
  pricePerHour?: number;
  createdAt?: Date;
  deletedAt?: Date | null;
}

export class RoomFactory {
  static make(override: RoomFactoryProps = {}): Room {
    return Room.restore({
      id: override.id ?? crypto.randomUUID(),
      name: override.name ?? 'Room A',
      description: null,
      type: override.type ?? RoomType.BOTH,
      capacity: override.capacity ?? 8,
      pricePerHour: new Money(override.pricePerHour ?? 50),
      operatingHours: new OperatingHours({
        monday: { open: '08:00', close: '22:00' },
        tuesday: { open: '08:00', close: '22:00' },
        wednesday: { open: '08:00', close: '22:00' },
        thursday: { open: '08:00', close: '22:00' },
        friday: { open: '08:00', close: '22:00' },
        saturday: { open: '09:00', close: '18:00' },
      }),
      createdAt: override.createdAt ?? new Date(),
      deletedAt: override.deletedAt ?? null,
    });
  }

  static makeRehearsal(override: RoomFactoryProps = {}): Room {
    return RoomFactory.make({ ...override, type: RoomType.REHEARSAL });
  }

  static makeRecording(override: RoomFactoryProps = {}): Room {
    return RoomFactory.make({ ...override, type: RoomType.RECORDING });
  }
}
