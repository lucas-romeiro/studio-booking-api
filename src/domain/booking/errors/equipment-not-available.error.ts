import { DomainError } from '../../shared';

export class EquipmentNotAvailableErro extends DomainError {
  constructor(name: string) {
    super(`No stock available for equipment ${name}`);
  }
}
