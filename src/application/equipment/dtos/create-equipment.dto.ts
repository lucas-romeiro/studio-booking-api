import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { EquipmentCategory } from '@/domain/equipment';

export class CreateEquipmentDto {
  @ApiProperty({ example: 'Marshall JCM800' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiPropertyOptional({ example: '100W Guitar Amplifier' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: EquipmentCategory })
  @IsEnum(EquipmentCategory)
  category!: EquipmentCategory;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  @IsPositive()
  pricePerDay!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  totalStock!: number;
}
