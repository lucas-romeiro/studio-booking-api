import { DomainError } from '../../shared';

export class Token {
  private readonly value: string;

  constructor(token: string) {
    if (!token || token.trim().length === 0) {
      throw new DomainError('Invalid token');
    }
    this.value = token;
  }

  toString(): string {
    return this.value;
  }
}
