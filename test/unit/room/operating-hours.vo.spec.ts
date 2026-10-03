import { OperatingHours } from '@/domain/room';
import { DomainError } from '@/domain/shared';

describe('Operating Hours Value Object', () => {
  describe('Creation Flow', () => {
    it('should create successfully  a valid operating-hours object', () => {
      const operatingHours = new OperatingHours({
        monday: { open: '08:00', close: '22:00' },
      });

      expect(operatingHours.toJSON()).toEqual({
        monday: { open: '08:00', close: '22:00' },
      });
    });
  });

  describe('Validation Flow', () => {
    it('should throw DomainError if opening time is after or equal to closing time', () => {
      expect(
        () =>
          new OperatingHours({
            monday: { open: '14:00', close: '12:00' },
          }),
      ).toThrow(
        new DomainError(
          'Invalid time for monday: opening must be before closing',
        ),
      );

      expect(
        () =>
          new OperatingHours({
            monday: { open: '12:00', close: '12:00' },
          }),
      ).toThrow(
        new DomainError(
          'Invalid time for monday: opening must be before closing',
        ),
      );
    });

    it('should throw DomainError if time format is invalid', () => {
      expect(
        () =>
          new OperatingHours({
            monday: { open: '8:00', close: '22:00' },
          }),
      ).toThrow(
        new DomainError('Invalid time format for monday. Expected HH:MM'),
      );
    });
  });

  describe('Business Logic', () => {
    const operatingHours = new OperatingHours({
      monday: { open: '08:00', close: '18:00' },
    });

    it('should return true if time is within operating hours', () => {
      expect(operatingHours.isOpenAt('monday', '12:00')).toBe(true);
      expect(operatingHours.isOpenAt('monday', '08:00')).toBe(true);
      expect(operatingHours.isOpenAt('monday', '18:00')).toBe(true);
    });

    it('should return false if time is outside operating hours', () => {
      expect(operatingHours.isOpenAt('monday', '07:59')).toBe(false);
      expect(operatingHours.isOpenAt('monday', '18:01')).toBe(false);
    });

    it('should return false if there are no operating hours defined for the day', () => {
      expect(operatingHours.isOpenAt('sunday', '12:00')).toBe(false);
    });

    it('should throw DomainError if query time format is invalid', () => {
      expect(() => operatingHours.isOpenAt('monday', '25:00')).toThrow(
        DomainError,
      );
    });
  });
});
