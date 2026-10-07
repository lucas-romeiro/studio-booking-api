import { DomainError } from '../../shared';

export class EquipmentNotAvailableError extends DomainError {
  constructor(name: string) {
    super(`Equipment ${name} is not available.`);
  }
}
