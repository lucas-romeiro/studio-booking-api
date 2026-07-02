import { DomainError } from '../../shared';

export class InvalidRefreshTokenError extends DomainError {
  constructor() {
    super('Invalid refresh token');
  }
}
