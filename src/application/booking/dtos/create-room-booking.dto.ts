import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsUUID } from 'class-validator';
import { RoomType } from '@/domain/room';

export class CreateRoomBookingDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  roomId!: string;

  @ApiProperty({ example: '2026-11-01T10:00.000Z' })
  @IsDateString()
  startTime!: string;

  @ApiProperty({ example: '2026-11-01T12:00:00.000Z' })
  @IsDateString()
  endTime!: string;

  @ApiProperty({ enum: RoomType })
  @IsEnum(RoomType)
  type!: RoomType;
}
