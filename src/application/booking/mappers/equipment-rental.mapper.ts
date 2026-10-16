import { EquipmentRental } from '@/domain/booking';
import { EquipmentRentalResponseDto } from '../dtos/equipment-rental-response.dto';

export class EquipmentRentalMapper {
  static toResponse(rental: EquipmentRental): EquipmentRentalResponseDto {
    return {
      id: rental.id,
      userId: rental.userId,
      equipmentId: rental.equipmentId,
      quantity: rental.quantity,
      startDate: rental.rentalPeriod.startDate,
      endDate: rental.rentalPeriod.endDate,
      totalPrice: rental.totalPrice.amount,
      currency: rental.totalPrice.currency,
      status: rental.status,
      createdAt: rental.createdAt,
    };
  }
}
