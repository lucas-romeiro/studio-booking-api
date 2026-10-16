import { ApiProperty } from '@nestjs/swagger';
import { RentalStatus } from '@/domain/booking';

export class EquipmentRentalResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  equipmentId!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  startDate!: Date;

  @ApiProperty()
  endDate!: Date;

  @ApiProperty()
  totalPrice!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty({ enum: RentalStatus })
  status!: RentalStatus;

  @ApiProperty()
  createdAt!: Date;
}
