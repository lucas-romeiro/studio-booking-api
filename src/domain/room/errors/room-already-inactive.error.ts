import { DomainError } from '../../shared';

export class RoomAlreadyInactiveError extends DomainError {
  constructor(id: string) {
    super(`Room ${id} is already inactive`);
  }
}
