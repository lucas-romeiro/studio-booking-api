import { Inject, Injectable } from '@nestjs/common';
import {
  EQUIPMENT_RENTAL_REPOSITORY,
  EquipmentRental,
  IEquipmentRentalRepository,
} from '@/domain/booking';
import {
  EQUIPMENT_REPOSITORY,
  EquipmentNotAvailableError,
  EquipmentNotFoundError,
  IEquipmentRepository,
  RentalPeriod,
} from '@/domain/equipment';
import { EquipmentRentalResponseDto } from '../dtos/equipment-rental-response.dto';
import { CreateEquipmentRentalDto } from '../dtos/create-equipment-rental.dto';
import { TokenPayload } from '@/domain/auth';
import { EquipmentRentalMapper } from '../mappers/equipment-rental.mapper';

@Injectable()
export class CreateEquipmentRentalUseCase {
  constructor(
    @Inject(EQUIPMENT_RENTAL_REPOSITORY)
    private readonly rentalRepository: IEquipmentRentalRepository,
    @Inject(EQUIPMENT_REPOSITORY)
    private readonly equipmentRepository: IEquipmentRepository,
  ) {}

  async execute(
    dto: CreateEquipmentRentalDto,
    currentUser: TokenPayload,
  ): Promise<EquipmentRentalResponseDto> {
    const equipment = await this.equipmentRepository.findById(dto.equipmentId);

    if (!equipment) {
      throw new EquipmentNotFoundError(dto.equipmentId);
    }

    if (equipment.availableStock > dto.quantity) {
      throw new EquipmentNotAvailableError(dto.equipmentId);
    }

    const rentalPeriod = new RentalPeriod(
      new Date(dto.startDate),
      new Date(dto.endDate),
    );

    const totalPrice = equipment
      .calculateRentalPrice(rentalPeriod.getDays())
      .multiply(dto.quantity);

    const rental = EquipmentRental.create({
      userId: currentUser.sub,
      equipmentId: dto.equipmentId,
      quantity: dto.quantity,
      rentalPeriod,
      totalPrice,
    });

    equipment.reserve(dto.quantity);

    await this.equipmentRepository.save(equipment);
    await this.rentalRepository.save(rental);

    return EquipmentRentalMapper.toResponse(rental);
  }
}
