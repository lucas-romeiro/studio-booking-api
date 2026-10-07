import { Equipment, EquipmentCategory } from '@/domain/equipment';
import { Money } from '@/domain/room';

interface EquipmentFactoryProps {
  id?: string;
  name?: string;
  category?: EquipmentCategory;
  pricePerDay?: number;
  totalStock?: number;
  availableStock?: number;
  createdAt?: Date;
  deleteAt?: Date | null;
}

export class EquipmentFactory {
  static make(override: EquipmentFactoryProps = {}): Equipment {
    const totalStock = override.totalStock ?? 2;
    return Equipment.restore({
      id: override.id ?? crypto.randomUUID(),
      name: override.name ?? 'Marshall JCM800',
      description: null,
      category: override.category ?? EquipmentCategory.GUITAR_AMP,
      pricePerDay: new Money(override.pricePerDay ?? 150),
      totalStock,
      availableStock: override.availableStock ?? totalStock,
      createdAt: override.createdAt ?? new Date(),
      deletedAt: override.deleteAt ?? null,
    });
  }

  static makeUnavailable(override: EquipmentFactoryProps = {}): Equipment {
    const totalStock = override.totalStock ?? 2;
    return EquipmentFactory.make({
      ...override,
      totalStock,
      availableStock: 0,
    });
  }

  static makeInactive(override: EquipmentFactoryProps = {}): Equipment {
    return EquipmentFactory.make({ ...override, deleteAt: new Date() });
  }
}
