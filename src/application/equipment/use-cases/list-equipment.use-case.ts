import { Inject, Injectable } from '@nestjs/common';
import { EQUIPMENT_REPOSITORY, IEquipmentRepository } from '@/domain/equipment';
import { EquipmentResponseDto } from '../dtos/equipment-response.dto';
import { EquipmentMapper } from '../mappers/equipment.mapper';
import { ListEquipmentDto } from '../dtos/list-equipment.dto';
import { paginate, PaginationResponse } from '@/shared';

@Injectable()
export class ListEquipmentUseCase {
  constructor(
    @Inject(EQUIPMENT_REPOSITORY)
    private readonly equipmentRepository: IEquipmentRepository,
  ) {}

  async execute(
    dto?: ListEquipmentDto,
  ): Promise<PaginationResponse<EquipmentResponseDto>> {
    const [equiment, total] = await this.equipmentRepository.findAll(dto);

    return paginate(
      equiment.map((e) => EquipmentMapper.toResponse(e)),
      total,
      dto?.page ?? 1,
      dto?.limit ?? 10,
    );
  }
}
