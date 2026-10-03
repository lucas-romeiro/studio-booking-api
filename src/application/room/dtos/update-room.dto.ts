import { OperatingHoursProps } from '@/domain/room';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateRoomDto {
  @ApiPropertyOptional({ example: 'Room B' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  capacity?: number;

  @ApiPropertyOptional({ example: 60.0 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pricePerHour?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  operatingHours?: OperatingHoursProps;
}
