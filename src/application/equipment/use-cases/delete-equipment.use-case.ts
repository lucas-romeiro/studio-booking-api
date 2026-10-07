import { Inject, Injectable } from '@nestjs/common';
import {
  EQUIPMENT_REPOSITORY,
  EquipmentAlreadyInactiveError,
  EquipmentNotFoundError,
  IEquipmentRepository,
} from '@/domain/equipment';

@Injectable()
export class DeleteEquipmentUseCase {
  constructor(
    @Inject(EQUIPMENT_REPOSITORY)
    private readonly equipmentRepository: IEquipmentRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const equipment = await this.equipmentRepository.findById(id);

    if (!equipment) {
      throw new EquipmentNotFoundError(id);
    }

    if (!equipment.isActive) {
      throw new EquipmentAlreadyInactiveError(id);
    }

    equipment.deactivate();

    await this.equipmentRepository.save(equipment);
  }
}
