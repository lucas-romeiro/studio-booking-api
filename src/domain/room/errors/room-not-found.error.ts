import { DomainError } from '../../shared';

export class RoomNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Room ${id} not found`);
  }
}
