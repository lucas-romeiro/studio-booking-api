import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OperatingHoursProps, RoomType } from '@/domain/room';

export class RoomResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string | null;

  @ApiProperty({ enum: RoomType })
  type!: RoomType;

  @ApiProperty()
  capacity!: number;

  @ApiProperty()
  pricePerHour!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  operatingHours!: OperatingHoursProps;

  @ApiProperty()
  createdAt!: Date;
}
