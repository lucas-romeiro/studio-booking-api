import { Inject, Injectable } from '@nestjs/common';
import {
  EQUIPMENT_REPOSITORY,
  EquipmentNotFoundError,
  IEquipmentRepository,
} from '@/domain/equipment';
import { UpdateEquipmentDto } from '../dtos/update-equipment.dto';
import { EquipmentResponseDto } from '../dtos/equipment-response.dto';
import { Money } from '@/domain/room';
import { EquipmentMapper } from '../mappers/equipment.mapper';

@Injectable()
export class UpdateEquipmentUseCase {
  constructor(
    @Inject(EQUIPMENT_REPOSITORY)
    private readonly equimentRepository: IEquipmentRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateEquipmentDto,
  ): Promise<EquipmentResponseDto> {
    const equipment = await this.equimentRepository.findById(id);

    if (!equipment) {
      throw new EquipmentNotFoundError(id);
    }

    if (dto.pricePerDay !== undefined) {
      equipment.updatePrice(new Money(dto.pricePerDay));
    }

    if (dto.totalStock !== undefined) {
      equipment.updateStock(dto.totalStock);
    }

    await this.equimentRepository.save(equipment);

    return EquipmentMapper.toResponse(equipment);
  }
}
