import { DomainError } from '../../shared';

export class EmailAlreadyInUseError extends DomainError {
  constructor(email: string) {
    super(`Email: ${email} already in use`);
  }
}
