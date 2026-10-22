import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EquipmentRentalOrmEntity,
  equipmentRentalRepositoryProvider,
  RoomBookingOrmEntity,
  roomBookingRepositoryProvider,
} from '@/infrastructure/database/typeorm';
import { RoomModule } from './room.module';
import { EquipmentModule } from './equipment.module';
import {
  RoomBookingsController,
  EquimentRentalsController,
} from '../http/controllers';
import {
  CancelEquipmentRentalUseCase,
  CancelRoomBookingUseCase,
  ConfirmEquipmentRentalUseCase,
  ConfirmeRoomBookingUseCase,
  CreateEquipmentRentalUseCase,
  CreateRoomBookingUseCase,
  ListEquipmentRentalsUseCase,
  ListRoomBookingsUseCase,
  ReturnEquipmentRentalUseCase,
} from '@/application/booking';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomBookingOrmEntity, EquipmentRentalOrmEntity]),
    forwardRef(() => RoomModule),
    EquipmentModule,
  ],
  controllers: [RoomBookingsController, EquimentRentalsController],
  providers: [
    CreateRoomBookingUseCase,
    CancelRoomBookingUseCase,
    ConfirmeRoomBookingUseCase,
    ListRoomBookingsUseCase,
    CreateEquipmentRentalUseCase,
    CancelEquipmentRentalUseCase,
    ListEquipmentRentalsUseCase,
    ConfirmEquipmentRentalUseCase,
    ReturnEquipmentRentalUseCase,
    roomBookingRepositoryProvider,
    equipmentRentalRepositoryProvider,
  ],
  exports: [roomBookingRepositoryProvider],
})
export class BookingModule {}
