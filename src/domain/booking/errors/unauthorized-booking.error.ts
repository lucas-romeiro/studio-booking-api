import { DomainError } from '../../shared';

export class UnauthorizedBookingError extends DomainError {
  constructor() {
    super('No permission to perform this operation on the reservation');
  }
}
