import { DomainError } from '../../shared';

export class RoomTypeNotAllowedError extends DomainError {
  constructor(type: string) {
    super(`Room not available for ${type}`);
  }
}
