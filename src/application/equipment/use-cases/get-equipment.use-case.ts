import { Inject, Injectable } from '@nestjs/common';
import {
  EQUIPMENT_REPOSITORY,
  EquipmentNotFoundError,
  IEquipmentRepository,
} from '@/domain/equipment';
import { EquipmentResponseDto } from '../dtos/equipment-response.dto';
import { EquipmentMapper } from '../mappers/equipment.mapper';

@Injectable()
export class GetEquipmentUseCase {
  constructor(
    @Inject(EQUIPMENT_REPOSITORY)
    private readonly equipmentRepository: IEquipmentRepository,
  ) {}

  async execute(id: string): Promise<EquipmentResponseDto> {
    const equipment = await this.equipmentRepository.findById(id);

    if (!equipment) {
      throw new EquipmentNotFoundError(id);
    }

    return EquipmentMapper.toResponse(equipment);
  }
}
