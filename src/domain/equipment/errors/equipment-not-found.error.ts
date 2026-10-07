import { DomainError } from '../../shared';

export class EquipmentNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Equipment ${id} not found`);
  }
}
