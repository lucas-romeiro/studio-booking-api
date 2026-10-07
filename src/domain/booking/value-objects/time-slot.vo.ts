import { DomainError } from '../../shared';

export class TimeSlot {
  constructor(
    public readonly startTime: Date,
    public readonly endTime: Date,
  ) {
    if (startTime >= endTime) {
      throw new DomainError('The start time must be before the end time');
    }

    if (TimeSlot.isBeforeNow(startTime)) {
      throw new DomainError('The start time cannot be in the past');
    }
  }

  getHours(): number {
    const ms = this.endTime.getTime() - this.startTime.getTime();
    return ms / (1000 * 60 * 60);
  }

  overlaps(other: TimeSlot): boolean {
    return this.startTime < other.endTime && this.endTime > other.startTime;
  }

  private static isBeforeNow(date: Date): boolean {
    const now = new Date();
    now.setSeconds(0, 0);
    return date < now;
  }
}
