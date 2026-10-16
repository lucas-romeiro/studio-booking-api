import { EquipmentRental, RentalStatus } from '@/domain/booking';
import { RentalPeriod } from '@/domain/equipment';
import { Money } from '@/domain/room';

interface EquipmentRentalFactoryProps {
  id?: string;
  userId?: string;
  equipmentId?: string;
  quantity?: number;
  status?: RentalStatus;
  createdAt?: Date;
  deletedAt?: Date | null;
}

const futureDate = (daysFromNow: number): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

export class EquipmentRentalFactory {
  static make(override: EquipmentRentalFactoryProps = {}): EquipmentRental {
    return EquipmentRental.restore({
      id: override.id ?? crypto.randomUUID(),
      userId: override.userId ?? crypto.randomUUID(),
      equipmentId: override.equipmentId ?? crypto.randomUUID(),
      quantity: override.quantity ?? 1,
      rentalPeriod: new RentalPeriod(futureDate(1), futureDate(3)),
      totalPrice: new Money(300),
      status: override.status ?? RentalStatus.PENDING,
      createdAt: override.createdAt ?? new Date(),
      deletedAt: override.deletedAt ?? null,
    });
  }

  static makeConfirmed(
    override: EquipmentRentalFactoryProps = {},
  ): EquipmentRental {
    return EquipmentRentalFactory.make({
      ...override,
      status: RentalStatus.CONFIRMED,
    });
  }

  static makeCancelled(
    override: EquipmentRentalFactoryProps = {},
  ): EquipmentRental {
    return EquipmentRentalFactory.make({
      ...override,
      status: RentalStatus.CANCELLED,
    });
  }
}
