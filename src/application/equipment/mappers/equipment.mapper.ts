import { Equipment } from '@/domain/equipment';
import { EquipmentResponseDto } from '../dtos/equipment-response.dto';

export class EquipmentMapper {
  static toResponse(equipment: Equipment): EquipmentResponseDto {
    return {
      id: equipment.id,
      name: equipment.name,
      description: equipment.description,
      category: equipment.category,
      pricePerDay: equipment.pricePerDay.amount,
      currency: equipment.pricePerDay.currency,
      totalStock: equipment.totalStock,
      availableStock: equipment.availableStock,
      isAvailable: equipment.isAvailable,
      createdAt: equipment.createdAt,
    };
  }
}
