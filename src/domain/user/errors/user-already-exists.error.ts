import { DomainError } from '../../shared/errors';

export class UserAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}
