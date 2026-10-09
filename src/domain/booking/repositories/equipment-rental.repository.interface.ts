import { PaginationDto } from '@/shared';
import { EquipmentRental } from '../entities/equipment-rental.entity';
import { RentalStatus } from '../value-objects/rental-status.vo';

export const EQUIPMENT_RENTAL_REPOSITORY = Symbol('IEquipmentRentalRepository');

export interface SearchEquipmentRentalsFilter extends PaginationDto {
  userId?: string;
  equipmentId?: string;
  status?: RentalStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface IEquipmentRentalRepository {
  save(rental: EquipmentRental): Promise<void>;
  findById(id: string): Promise<EquipmentRental | null>;
  findAll(
    filter?: SearchEquipmentRentalsFilter,
  ): Promise<[EquipmentRental[], number]>;
  findActiveByEquipmentId(equipmentId: string): Promise<EquipmentRental[]>;
  exists(id: string): Promise<boolean>;
}
