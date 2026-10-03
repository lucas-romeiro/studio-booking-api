import { Money, OperatingHours, Room } from '@/domain/room';
import { RoomOrmEntity } from '../entities/room.orm-entity';

export class RoomOrmMapper {
  static toDomain(orm: RoomOrmEntity): Room {
    return Room.restore({
      id: orm.id,
      name: orm.name,
      description: orm.description ?? null,
      type: orm.type,
      capacity: orm.capacity,
      pricePerHour: new Money(Number(orm.pricePerHour), orm.currency),
      operatingHours: new OperatingHours(orm.operatingHours),
      createdAt: orm.createdAt,
      deletedAt: orm.deletedAt,
    });
  }

  static toOrm(domain: Room): RoomOrmEntity {
    const orm = new RoomOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.description = domain.description;
    orm.type = domain.type;
    orm.capacity = domain.capacity;
    orm.pricePerHour = domain.pricePerHour.amount;
    orm.currency = domain.pricePerHour.currency;
    orm.operatingHours = domain.operatingHours.toJSON();
    orm.createdAt = domain.createdAt;
    orm.deletedAt = domain.deletedAt;
    return orm;
  }
}
