import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { RoomType, OperatingHoursProps } from '@/domain/room';

export class CreateRoomDto {
  @ApiProperty({ example: 'Room A' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiPropertyOptional({ example: 'Room with drum and guitar amplifiers' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: RoomType })
  @IsEnum(RoomType)
  type!: RoomType;

  @ApiProperty({ example: 8 })
  @IsInt()
  @IsPositive()
  capacity!: number;

  @ApiProperty({ example: 50.0 })
  @IsNumber()
  @IsPositive()
  pricePerHour!: number;

  @ApiProperty({
    example: {
      monday: { open: '08:00', close: '22:00' },
      saturday: { open: '09:00', close: '18:00' },
    },
  })
  @IsObject()
  operatingHours!: OperatingHoursProps;
}
