import { DomainError } from '../../shared';

export class EquipmentRentalNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Equipment rental ${id} not found`);
  }
}
