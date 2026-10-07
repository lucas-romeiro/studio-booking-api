import { Provider } from '@nestjs/common';
import { EQUIPMENT_REPOSITORY } from '@/domain/equipment';
import { EquipmentTypeOrmRepository } from '../equipment.typeorm-repository';

export const equipmentRepositoryProvider: Provider = {
  provide: EQUIPMENT_REPOSITORY,
  useClass: EquipmentTypeOrmRepository,
};
