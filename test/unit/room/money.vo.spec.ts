import { Money } from '@/domain/room';
import { DomainError } from '@/domain/shared';

describe('Money Value Object', () => {
  describe('Creation Flow', () => {
    it('should successfully create a valid money object', () => {
      const money = new Money(100, 'USD');

      expect(money.toString()).toBe('USD 100.00');
    });

    it('should handle float values and round them to 2 decimal places', () => {
      const money = new Money(10.556);

      expect(money.amount).toBe(10.56);
    });
  });

  describe('Validation Flow', () => {
    it('should throw an DomainError if the amount is less than 0', () => {
      expect(() => new Money(-1, 'USD')).toThrow(
        new DomainError('Value cannot be negative'),
      );
    });

    it('should throw an DomainError to add different currencies', () => {
      const usdMoney = new Money(100, 'USD');
      const brlMoney = new Money(100);

      expect(() => usdMoney.add(brlMoney)).toThrow(
        new DomainError(
          `Different currencies: ${usdMoney.currency} and ${brlMoney.currency}`,
        ),
      );
    });

    it('should throw an DomainError to verify if two different currencies are greater than other', () => {
      const usdMoney = new Money(100, 'USD');
      const brlMoney = new Money(100);

      expect(() => usdMoney.isGreaterThan(brlMoney)).toThrow(
        new DomainError(
          `Different currencies: ${usdMoney.currency} and ${brlMoney.currency}`,
        ),
      );
    });
  });

  describe('Bussiness Operations', () => {
    it('should add two money objects of the same currency', () => {
      const m1 = new Money(10.5);
      const m2 = new Money(20.0);

      expect(m1.add(m2).amount).toBe(30.5);
    });

    it('should multiply money by a factor and avoid float issues', () => {
      const money = new Money(10.25);

      expect(money.multiply(3).amount).toBe(30.75);
    });

    it('should correctly compare if one money is greater than another', () => {
      const m1 = new Money(20);
      const m2 = new Money(10);

      expect(m1.isGreaterThan(m2)).toBe(true);
      expect(m2.isGreaterThan(m1)).toBe(false);
    });

    it('should return true if two money objects are equal', () => {
      const m1 = new Money(10);
      const m2 = new Money(10);

      expect(m1.equals(m2)).toBe(true);
    });
  });
});
