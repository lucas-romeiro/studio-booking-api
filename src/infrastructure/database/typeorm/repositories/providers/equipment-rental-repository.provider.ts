import { Provider } from '@nestjs/common';
import { EQUIPMENT_RENTAL_REPOSITORY } from '@/domain/booking';
import { EquipmentRentalTypeOrmRepository } from '../equipment-rental.typeorm-repository';

export const equipmentRentalRepositoryProvider: Provider = {
  provide: EQUIPMENT_RENTAL_REPOSITORY,
  useClass: EquipmentRentalTypeOrmRepository,
};
