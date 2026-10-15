import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsPositive, IsUUID } from 'class-validator';

export class CreateEquipmentRentalDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  equipmentId!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  quantity!: number;

  @ApiProperty({ example: '2026-11-01' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2026-11-03' })
  @IsDateString()
  endDate!: string;
}
