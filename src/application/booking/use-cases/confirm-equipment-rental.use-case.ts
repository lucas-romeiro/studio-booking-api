import { Inject, Injectable } from '@nestjs/common';
import {
  EQUIPMENT_RENTAL_REPOSITORY,
  EquipmentRentalNotFoundError,
  IEquipmentRentalRepository,
} from '@/domain/booking';
import { EquipmentRentalResponseDto } from '../dtos/equipment-rental-response.dto';
import { EquipmentRentalMapper } from '../mappers/equipment-rental.mapper';

@Injectable()
export class ConfirmEquipmentRentalUseCase {
  constructor(
    @Inject(EQUIPMENT_RENTAL_REPOSITORY)
    private readonly rentalRepository: IEquipmentRentalRepository,
  ) {}

  async execute(id: string): Promise<EquipmentRentalResponseDto> {
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new EquipmentRentalNotFoundError(id);
    }

    rental.confirm();
    await this.rentalRepository.save(rental);

    return EquipmentRentalMapper.toResponse(rental);
  }
}
