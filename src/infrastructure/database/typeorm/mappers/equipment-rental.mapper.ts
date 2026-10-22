import { EquipmentRental } from '@/domain/booking';
import { RentalPeriod } from '@/domain/equipment';
import { Money } from '@/domain/room';
import { EquipmentRentalOrmEntity } from '../entities/equipment-rental.orm-entity';

export class EquipmentRentalOrmMapper {
  static toDomain(orm: EquipmentRentalOrmEntity): EquipmentRental {
    return EquipmentRental.restore({
      id: orm.id,
      userId: orm.userId,
      equipmentId: orm.equipmentId,
      quantity: orm.quantity,
      rentalPeriod: new RentalPeriod(orm.startDate, orm.endDate),
      totalPrice: new Money(orm.totalPrice, orm.currency),
      status: orm.status,
      createdAt: orm.createdAt,
      deletedAt: orm.deletedAt,
    });
  }

  static toOrm(domain: EquipmentRental): EquipmentRentalOrmEntity {
    const orm = new EquipmentRentalOrmEntity();
    orm.id = domain.id;
    orm.userId = domain.userId;
    orm.equipmentId = domain.equipmentId;
    orm.quantity = domain.quantity;
    orm.startDate = domain.rentalPeriod.startDate;
    orm.endDate = domain.rentalPeriod.endDate;
    orm.totalPrice = domain.totalPrice.amount;
    orm.currency = domain.totalPrice.currency;
    orm.status = domain.status;
    orm.createdAt = domain.createdAt;
    orm.deletedAt = domain.deletedAt;
    return orm;
  }
}
