import { PaginationDto } from '@/shared';
import { Equipment } from '../entities/equipment.entity';
import { EquipmentCategory } from '../value-objects/equipment-category.vo';

export const EQUIPMENT_REPOSITORY = Symbol('IEquipmentRepository');

export interface SearchEquipmentFilter extends PaginationDto {
  category?: EquipmentCategory;
  available?: boolean;
  maxPricePerDay?: number;
}

export interface IEquipmentRepository {
  save(equipment: Equipment): Promise<void>;
  findById(id: string): Promise<Equipment | null>;
  findAll(filter?: SearchEquipmentFilter): Promise<[Equipment[], number]>;
  exists(id: string): Promise<boolean>;
}
