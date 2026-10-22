import { Inject, Injectable } from '@nestjs/common';
import {
  IRoomRepository,
  ROOM_REPOSITORY,
  RoomNotFoundError,
} from '@/domain/room';
import {
  IRoomBookingRepository,
  ROOM_BOOKING_REPOSITORY,
} from '@/domain/booking';
import {
  RoomAvailabilityResponseDto,
  TimeSlotDto,
} from '../dtos/room-availability-response.dto';

@Injectable()
export class GetRoomAvailabilityUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepository: IRoomRepository,
    @Inject(ROOM_BOOKING_REPOSITORY)
    private readonly roomBookingRepository: IRoomBookingRepository,
  ) {}

  async execute(
    roomId: string,
    date: string,
  ): Promise<RoomAvailabilityResponseDto> {
    const room = await this.roomRepository.findById(roomId);

    if (!room) {
      throw new RoomNotFoundError(roomId);
    }

    const targetDate = new Date(date);
    const weekDay = this.getWeekDay(targetDate);
    const daysHours = room.operatingHours.getHours(weekDay);

    if (!daysHours) {
      return {
        roomId,
        date,
        bookedSlots: [],
        availableSlots: [],
      };
    }

    const bookings = await this.roomBookingRepository.findByRoomAndDate(
      roomId,
      targetDate,
    );

    const bookedSlots: TimeSlotDto[] = bookings.map((b) => ({
      startTime: b.timeSlot.startTime,
      endTime: b.timeSlot.endTime,
    }));

    const availableSlots = this.calculateAvailabelSlots(
      targetDate,
      daysHours.open,
      daysHours.close,
      bookedSlots,
    );

    return { roomId, date, bookedSlots, availableSlots };
  }

  private calculateAvailabelSlots(
    date: Date,
    open: string,
    close: string,
    bookedSlots: TimeSlotDto[],
  ): TimeSlotDto[] {
    const toDateTime = (timeStr: string): Date => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const dt = new Date(date);
      dt.setHours(hours, minutes, 0, 0);
      return dt;
    };

    const slots: TimeSlotDto[] = [];
    let current = toDateTime(open);
    const closing = toDateTime(close);

    const sorted = [...bookedSlots].sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime(),
    );

    for (const booked of sorted) {
      if (current < booked.startTime) {
        slots.push({ startTime: current, endTime: booked.startTime });
      }

      if (booked.endTime > current) {
        current = booked.endTime;
      }
    }

    if (current < closing) {
      slots.push({ startTime: current, endTime: closing });
    }

    return slots;
  }

  private getWeekDay(date: Date) {
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ] as const;
    return days[date.getDay()];
  }
}
