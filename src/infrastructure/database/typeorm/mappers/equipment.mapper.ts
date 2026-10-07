import { Equipment } from '@/domain/equipment';
import { Money } from '@/domain/room';
import { EquipmentOrmEntity } from '../entities/equipment.orm-entity';

export class EquipmentOrmMapper {
  static toDomain(orm: EquipmentOrmEntity): Equipment {
    return Equipment.restore({
      id: orm.id,
      name: orm.name,
      description: orm.description,
      category: orm.category,
      pricePerDay: new Money(Number(orm.pricePerDay), orm.currency),
      totalStock: orm.totalStock,
      availableStock: orm.availableStock,
      createdAt: orm.createdAt,
      deletedAt: orm.deletedAt,
    });
  }

  static toOrm(domain: Equipment): EquipmentOrmEntity {
    const orm = new EquipmentOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.description = domain.description;
    orm.category = domain.category;
    orm.pricePerDay = domain.pricePerDay.amount;
    orm.currency = domain.pricePerDay.currency;
    orm.totalStock = domain.totalStock;
    orm.availableStock = domain.availableStock;
    orm.createdAt = domain.createdAt;
    orm.deletedAt = domain.deletedAt;
    return orm;
  }
}
