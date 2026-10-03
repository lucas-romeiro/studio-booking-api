import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  RoomOrmEntity,
  roomRepositoryProvider,
} from '@/infrastructure/database/typeorm';
import {
  CreateRoomUseCase,
  DeleteRoomUseCase,
  GetRoomUseCase,
  SearchRoomsUseCase,
  UpdateRoomUseCase,
} from '@/application/room';
import { RoomController } from '../http/controllers';

@Module({
  imports: [TypeOrmModule.forFeature([RoomOrmEntity])],
  controllers: [RoomController],
  providers: [
    CreateRoomUseCase,
    GetRoomUseCase,
    SearchRoomsUseCase,
    UpdateRoomUseCase,
    DeleteRoomUseCase,
    roomRepositoryProvider,
  ],
  exports: [roomRepositoryProvider],
})
export class RoomModule {}
