import { DomainError } from '../../shared';

export class RentalPeriod {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date,
  ) {
    if (startDate >= endDate) {
      throw new DomainError('The start date must be before the end date');
    }

    if (RentalPeriod.isBeforeToday(startDate)) {
      throw new DomainError('Start date cannot be in the past');
    }
  }

  getDays(): number {
    const ms = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  }

  overlaps(other: RentalPeriod): boolean {
    return this.startDate < other.endDate && this.endDate > other.startDate;
  }

  private static isBeforeToday(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }
}
