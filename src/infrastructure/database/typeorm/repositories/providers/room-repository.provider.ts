import { Provider } from '@nestjs/common';
import { ROOM_REPOSITORY } from '@/domain/room';
import { RoomTypeOrmRepository } from '../room.typeorm-repository';

export const roomRepositoryProvider: Provider = {
  provide: ROOM_REPOSITORY,
  useClass: RoomTypeOrmRepository,
};
