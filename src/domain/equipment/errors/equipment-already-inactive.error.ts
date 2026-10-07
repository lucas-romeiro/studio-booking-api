import { DomainError } from '../../shared';

export class EquipmentAlreadyInactiveError extends DomainError {
  constructor(id: string) {
    super(`Equipment ${id} is already inactive.`);
  }
}
