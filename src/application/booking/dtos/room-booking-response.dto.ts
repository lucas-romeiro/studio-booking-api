import { ApiProperty } from '@nestjs/swagger';
import { RoomType } from '@/domain/room';
import { BookingStatus } from '@/domain/booking';

export class RoomBookingResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  roomId!: string;

  @ApiProperty()
  startTime!: Date;

  @ApiProperty()
  endTime!: Date;

  @ApiProperty({ enum: RoomType })
  type!: RoomType;

  @ApiProperty()
  totalPrice!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty({ enum: BookingStatus })
  status!: BookingStatus;

  @ApiProperty()
  createdAt!: Date;
}
