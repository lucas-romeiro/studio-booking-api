import { DomainError } from '../../shared';

export class RoomNotAvailableError extends DomainError {
  constructor() {
    super('Room not available for the requested time');
  }
}
