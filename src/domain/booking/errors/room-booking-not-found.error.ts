import { DomainError } from '../../shared';

export class RoomBookingNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Room reservation ${id} not found`);
  }
}
