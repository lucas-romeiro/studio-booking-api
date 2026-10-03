import { DomainError } from '../../shared';

export class RoomNotAvailableForTypeError extends DomainError {
  constructor(type: string) {
    super(`Room is not available for ${type}`);
  }
}
