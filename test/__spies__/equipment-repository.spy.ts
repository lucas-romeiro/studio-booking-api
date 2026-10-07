import {
  Equipment,
  IEquipmentRepository,
  SearchEquipmentFilter,
} from '@/domain/equipment';

export class InMemoryEquipmentRepository implements IEquipmentRepository {
  public equipment: Equipment[] = [];

  async save(equipment: Equipment): Promise<void> {
    const index = this.equipment.findIndex((e) => e.id === equipment.id);
    if (index >= 0) {
      this.equipment[index] = equipment;
    } else {
      this.equipment.push(equipment);
    }
    return Promise.resolve();
  }

  async findById(id: string): Promise<Equipment | null> {
    const equipment = this.equipment.find((e) => e.id === id) ?? null;
    return Promise.resolve(equipment);
  }

  async findAll(
    filter?: SearchEquipmentFilter,
  ): Promise<[Equipment[], number]> {
    const equipments = this.equipment.filter((e) => {
      if (filter?.category && e.category !== filter.category) {
        return false;
      }

      if (filter?.available && e.availableStock === 0) {
        return false;
      }

      if (
        filter?.maxPricePerDay &&
        e.pricePerDay.amount > filter.maxPricePerDay
      ) {
        return false;
      }

      return true;
    });

    const total = equipments.length;

    const skip = filter?.skip ?? 0;
    const limit = filter?.limit ?? 10;
    const result = equipments.slice(skip, skip + limit);

    return Promise.resolve([result, total]);
  }

  async exists(id: string): Promise<boolean> {
    const equipment = this.equipment.some((e) => e.id === id);
    return Promise.resolve(equipment);
  }
}
