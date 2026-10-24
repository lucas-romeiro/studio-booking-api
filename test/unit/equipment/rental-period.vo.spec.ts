import { RentalPeriod } from '@/domain/equipment';
import { DomainError } from '@/domain/shared';
import {
  addDays,
  dayAfterTomorrow,
  startOfDay,
  tomorrow,
  yesterday,
} from '../../helpers';

describe('Rental Period Value Objects', () => {
  describe('Creation & Validation', () => {
    it('should create a valid rental period successfully', () => {
      const start = tomorrow();
      const end = dayAfterTomorrow();
      const period = new RentalPeriod(start, end);

      expect(period.startDate).toEqual(start);
      expect(period.endDate).toEqual(end);
    });

    it('should accept today as a valid start date', () => {
      const today = startOfDay(new Date());

      const period = new RentalPeriod(today, tomorrow());
      expect(period.startDate).toEqual(today);
    });

    it('should throw DomainError if start date is in the past', () => {
      expect(() => new RentalPeriod(yesterday(), tomorrow())).toThrow(
        DomainError,
      );
      expect(() => new RentalPeriod(yesterday(), tomorrow())).toThrow(
        'Start date cannot be in the past',
      );
    });
  });

  it('should throw DomainError if start and end dates are equal', () => {
    const date = tomorrow();

    expect(() => new RentalPeriod(date, date)).toThrow(DomainError);
    expect(() => new RentalPeriod(date, date)).toThrow(
      'The start date must be before the end date',
    );
  });

  describe('Overlap Detection', () => {
    it('should return true when periods overlap', () => {
      const period = new RentalPeriod(tomorrow(), dayAfterTomorrow());
      expect(period.getDays()).toBe(1);
    });
  });

  describe('Overlap Detection', () => {
    it('should return true when periods overlap', () => {
      const a = new RentalPeriod(tomorrow(), dayAfterTomorrow());
      const b = new RentalPeriod(tomorrow(), dayAfterTomorrow());

      expect(a.overlaps(b)).toBe(true);
    });

    it('should return false when periods are consecutive (no overlap)', () => {
      const today = startOfDay(new Date());
      const a = new RentalPeriod(tomorrow(), dayAfterTomorrow());
      const b = new RentalPeriod(dayAfterTomorrow(), addDays(today, 3));

      expect(a.overlaps(b)).toBe(false);
    });
  });
});
