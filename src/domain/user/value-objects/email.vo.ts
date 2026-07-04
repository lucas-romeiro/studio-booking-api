import { DomainError } from '../../shared';

export class Email {
  private readonly value: string;

  constructor(email: string) {
    const sanitizedEmail = email.trim().toLocaleLowerCase();

    if (!Email.isValid(sanitizedEmail)) {
      throw new DomainError(`Invalid Email address: ${email}`);
    }

    this.value = sanitizedEmail;
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  toString(): string {
    return this.value;
  }
}
