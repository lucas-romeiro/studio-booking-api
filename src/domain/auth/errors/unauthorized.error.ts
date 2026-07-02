import { DomainError } from '../../shared';

export class UnauthorizedError extends DomainError {
  constructor() {
    super('Unauthorized');
  }
}
