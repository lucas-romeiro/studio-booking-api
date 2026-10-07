import { Inject, Injectable } from '@nestjs/common';
import {
  Equipment,
  EQUIPMENT_REPOSITORY,
  IEquipmentRepository,
} from '@/domain/equipment';
import { CreateEquipmentDto } from '../dtos/create-equipment.dto';
import { EquipmentResponseDto } from '../dtos/equipment-response.dto';
import { Money } from '@/domain/room';
import { EquipmentMapper } from '../mappers/equipment.mapper';

@Injectable()
export class CreateEquipmentUseCase {
  constructor(
    @Inject(EQUIPMENT_REPOSITORY)
    private readonly equipmentRepository: IEquipmentRepository,
  ) {}

  async execute(dto: CreateEquipmentDto): Promise<EquipmentResponseDto> {
    const equipment = Equipment.create({
      name: dto.name,
      description: dto.description,
      category: dto.category,
      pricePerDay: new Money(dto.pricePerDay),
      totalStock: dto.totalStock,
    });

    await this.equipmentRepository.save(equipment);

    return EquipmentMapper.toResponse(equipment);
  }
}
