import { DomainError } from '../../shared';

export class UserNotFoundError extends DomainError {
  constructor(id: string) {
    super(`User ${id} not found`);
  }
}
