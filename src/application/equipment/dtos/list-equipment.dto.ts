import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@/shared';
import { EquipmentCategory } from '@/domain/equipment';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ListEquipmentDto extends PaginationDto {
  @ApiPropertyOptional({ enum: EquipmentCategory })
  @IsOptional()
  @IsEnum(EquipmentCategory)
  category?: EquipmentCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  available?: boolean;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  maxPricePerDay?: number;
}
