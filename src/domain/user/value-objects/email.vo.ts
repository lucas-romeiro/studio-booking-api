import { DomainError } from '../../shared';

export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!Email.isValid(email)) {
      throw new DomainError(`Invalid Email address: ${email}`);
    }
    this.value = email.toLocaleLowerCase().trim();
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  toString(): string {
    return this.value;
  }
}
