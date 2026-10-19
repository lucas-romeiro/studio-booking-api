import { Inject, Injectable } from '@nestjs/common';
import {
  EQUIPMENT_RENTAL_REPOSITORY,
  EquipmentRentalNotFoundError,
  IEquipmentRentalRepository,
  UnauthorizedBookingError,
} from '@/domain/booking';
import { EQUIPMENT_REPOSITORY, IEquipmentRepository } from '@/domain/equipment';
import { TokenPayload } from '@/domain/auth';
import { UserRole } from '@/domain/user';

@Injectable()
export class CancelEquipmentRentalUseCase {
  constructor(
    @Inject(EQUIPMENT_RENTAL_REPOSITORY)
    private readonly rentalRepository: IEquipmentRentalRepository,
    @Inject(EQUIPMENT_REPOSITORY)
    private readonly equimentRepository: IEquipmentRepository,
  ) {}

  async execute(id: string, currentUser: TokenPayload): Promise<void> {
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new EquipmentRentalNotFoundError(id);
    }

    const isOwner = rental.userId === currentUser.sub;
    const isStaffOrAdmin = [UserRole.ADMIN, UserRole.STAFF].includes(
      currentUser.role as UserRole,
    );

    if (!isOwner && !isStaffOrAdmin) {
      throw new UnauthorizedBookingError();
    }

    rental.cancel();

    const equipment = await this.equimentRepository.findById(
      rental.equipmentId,
    );
    if (equipment) {
      equipment.release(rental.quantity);
      await this.equimentRepository.save(equipment);
    }

    await this.rentalRepository.save(rental);
  }
}
