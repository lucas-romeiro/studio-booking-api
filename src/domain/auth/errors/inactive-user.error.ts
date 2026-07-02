import { DomainError } from '../../shared';

export class InactiveUserError extends DomainError {
  constructor() {
    super('Inactive user');
  }
}
