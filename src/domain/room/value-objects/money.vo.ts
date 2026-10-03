import { DomainError } from '../../shared';

export class Money {
  private readonly _amountInCents: number;
  private readonly _currency: string;

  constructor(amount: number, currency: string = 'BRL') {
    if (amount < 0) {
      throw new DomainError('Value cannot be negative');
    }

    this._amountInCents = Math.round(amount * 100);
    this._currency = currency;
  }

  get amount(): number {
    return this._amountInCents / 100;
  }

  get currency(): string {
    return this._currency;
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._amountInCents > other._amountInCents;
  }

  equals(other: Money): boolean {
    return (
      this._amountInCents === other._amountInCents &&
      this.currency === other.currency
    );
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new DomainError(
        `Different currencies: ${this.currency} and ${other.currency}`,
      );
    }
  }

  toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
}
