import { Inject, Injectable } from '@nestjs/common';
import {
  EQUIPMENT_RENTAL_REPOSITORY,
  EquipmentRentalNotFoundError,
  IEquipmentRentalRepository,
} from '@/domain/booking';
import { EQUIPMENT_REPOSITORY, IEquipmentRepository } from '@/domain/equipment';
import { EquipmentRentalResponseDto } from '../dtos/equipment-rental-response.dto';
import { EquipmentRentalMapper } from '../mappers/equipment-rental.mapper';

@Injectable()
export class ReturnEquipmentRentalUseCase {
  constructor(
    @Inject(EQUIPMENT_RENTAL_REPOSITORY)
    private readonly rentalRepository: IEquipmentRentalRepository,
    @Inject(EQUIPMENT_REPOSITORY)
    private readonly equipmentRepository: IEquipmentRepository,
  ) {}

  async execute(id: string): Promise<EquipmentRentalResponseDto> {
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new EquipmentRentalNotFoundError(id);
    }

    rental.markAsReturned();

    const equipment = await this.equipmentRepository.findById(
      rental.equipmentId,
    );
    if (equipment) {
      equipment.release(rental.quantity);
      await this.equipmentRepository.save(equipment);
    }

    await this.rentalRepository.save(rental);

    return EquipmentRentalMapper.toResponse(rental);
  }
}
