import { TimeSlot } from '@/domain/booking';
import { DomainError } from '@/domain/shared';

describe('TimeSlot Value Object', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-07T14:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const today = () => {
    const d = new Date();
    d.setHours(16, 0, 0, 0);
    return d;
  };

  const tomorrow = () => addDays(new Date(), 1);
  const dayAfterTomorrow = () => addDays(new Date(), 2);
  const yesterday = () => addDays(new Date(), -1);

  describe('Creation & Validation', () => {
    it('should create a valid TimeSlot period successfully', () => {
      const start = tomorrow();
      const end = dayAfterTomorrow();
      const period = new TimeSlot(start, end);

      expect(period.startTime).toEqual(start);
      expect(period.endTime).toEqual(end);
    });

    it('should accept today as a valid start date if in the future', () => {
      const start = today();
      const end = addDays(start, 1);
      const period = new TimeSlot(start, end);

      expect(period.startTime).toEqual(start);
    });

    it('should throw DomainError if start date is in the past', () => {
      expect(() => new TimeSlot(yesterday(), tomorrow())).toThrow(DomainError);
      expect(() => new TimeSlot(yesterday(), tomorrow())).toThrow(
        'The start time cannot be in the past',
      );
    });

    it('should throw DomainError if start time is greater than or equal to end time', () => {
      const start = tomorrow();
      const end = today();

      expect(() => new TimeSlot(start, end)).toThrow(DomainError);
      expect(() => new TimeSlot(start, end)).toThrow(
        'The start time must be before the end time',
      );
    });
  });

  describe('getHours()', () => {
    it('should return the correct duration in hours', () => {
      const start = new Date('2026-10-07T15:00:00Z');
      const end = new Date('2026-10-07T18:30:00Z');
      const period = new TimeSlot(start, end);

      expect(period.getHours()).toBe(3.5);
    });
  });

  describe('overlaps()', () => {
    it('should return true if slots overlap', () => {
      const slot1 = new TimeSlot(
        new Date('2026-10-07T15:00:00Z'),
        new Date('2026-10-07T18:00:00Z'),
      );
      const slot2 = new TimeSlot(
        new Date('2026-10-07T17:00:00Z'),
        new Date('2026-10-07T20:00:00Z'),
      );

      expect(slot1.overlaps(slot2)).toBe(true);
    });

    it('should return false if slots do not overlap', () => {
      const slot1 = new TimeSlot(
        new Date('2026-10-07T15:00:00Z'),
        new Date('2026-10-07T17:00:00Z'),
      );
      const slot2 = new TimeSlot(
        new Date('2026-10-07T18:00:00Z'),
        new Date('2026-10-07T20:00:00Z'),
      );

      expect(slot1.overlaps(slot2)).toBe(false);
    });
  });
});
