import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EquipmentCategory } from '@/domain/equipment';

export class EquipmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string | null;

  @ApiProperty({ enum: EquipmentCategory })
  category!: EquipmentCategory;

  @ApiProperty()
  pricePerDay!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  totalStock!: number;

  @ApiProperty()
  availableStock!: number;

  @ApiProperty()
  isAvailable!: boolean;

  @ApiProperty()
  createdAt!: Date;
}
