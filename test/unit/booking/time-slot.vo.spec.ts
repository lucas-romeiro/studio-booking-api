import { TimeSlot } from '@/domain/booking';
import { DomainError } from '@/domain/shared';
import { addDays, dayAfterTomorrow, tomorrow, yesterday } from '../../helpers';

describe('TimeSlot Value Object', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-07T14:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Creation & Validation', () => {
    it('should create a valid TimeSlot period successfully', () => {
      const start = tomorrow();
      const end = dayAfterTomorrow();
      const period = new TimeSlot(start, end);

      expect(period.startTime).toEqual(start);
      expect(period.endTime).toEqual(end);
    });

    it('should accept today as a valid start date if in the future', () => {
      const start = tomorrow();
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
      const end = tomorrow();

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
