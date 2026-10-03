import { DomainError } from '../../shared';

export interface DayHours {
  open: string;
  close: string;
}

export type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type OperatingHoursProps = Partial<Record<WeekDay, DayHours>>;

export class OperatingHours {
  private readonly hours: OperatingHoursProps;
  private static readonly TIME_REGEX = /^([0-1]\d|2[0-3]):([0-5]\d)$/;

  constructor(hours: OperatingHoursProps) {
    this.validate(hours);
    this.hours = structuredClone(hours);
  }

  isOpenAt(day: WeekDay, time: string): boolean {
    if (!OperatingHours.TIME_REGEX.test(time)) {
      throw new DomainError(`Invalid time format: ${time}. Expected HH:MM`);
    }

    const dayHours = this.hours[day];

    if (!dayHours) {
      return false;
    }

    return time >= dayHours.open && time <= dayHours.close;
  }

  getHours(day: WeekDay): DayHours | null {
    const dayHours = this.hours[day];
    return dayHours ? { ...dayHours } : null;
  }

  toJSON(): OperatingHoursProps {
    return structuredClone(this.hours);
  }

  private validate(hours: OperatingHoursProps): void {
    for (const [day, range] of Object.entries(hours)) {
      if (!range) continue;

      if (
        !OperatingHours.TIME_REGEX.test(range.open) ||
        !OperatingHours.TIME_REGEX.test(range.close)
      ) {
        throw new DomainError(`Invalid time format for ${day}. Expected HH:MM`);
      }

      if (range.open >= range.close) {
        throw new DomainError(
          `Invalid time for ${day}: opening must be before closing`,
        );
      }
    }
  }
}
