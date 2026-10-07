import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EquipmentOrmEntity,
  equipmentRepositoryProvider,
} from '@/infrastructure/database/typeorm';
import { EquipmentController } from '../http/controllers';
import {
  CreateEquipmentUseCase,
  DeleteEquipmentUseCase,
  GetEquipmentUseCase,
  ListEquipmentUseCase,
  UpdateEquipmentUseCase,
} from '@/application/equipment';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentOrmEntity])],
  controllers: [EquipmentController],
  providers: [
    CreateEquipmentUseCase,
    GetEquipmentUseCase,
    ListEquipmentUseCase,
    UpdateEquipmentUseCase,
    DeleteEquipmentUseCase,
    equipmentRepositoryProvider,
  ],
  exports: [equipmentRepositoryProvider],
})
export class EquipmentModule {}
