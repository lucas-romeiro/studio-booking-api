import { DomainError } from '../../shared';

export class EquipmentNotAvailableError extends DomainError {
  constructor(name: string) {
    super(`No stock available for equipment ${name}`);
  }
}
