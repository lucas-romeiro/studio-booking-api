import { ApiProperty } from '@nestjs/swagger';

export class TimeSlotDto {
  @ApiProperty()
  startTime!: Date;

  @ApiProperty()
  endTime!: Date;
}

export class RoomAvailabilityResponseDto {
  @ApiProperty()
  roomId!: string;

  @ApiProperty()
  date!: string;

  @ApiProperty({ type: [TimeSlotDto] })
  bookedSlots!: TimeSlotDto[];

  @ApiProperty({ type: [TimeSlotDto] })
  availableSlots!: TimeSlotDto[];
}
