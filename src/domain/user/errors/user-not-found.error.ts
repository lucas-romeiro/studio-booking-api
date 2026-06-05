import { DomainError } from '../../shared/errors';

export class UserNotFoundError extends DomainError {
  constructor(id: string) {
    super(`User ${id} not found`);
  }
}
