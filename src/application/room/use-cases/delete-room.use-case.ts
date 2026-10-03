import { Inject, Injectable } from '@nestjs/common';
import {
  IRoomRepository,
  ROOM_REPOSITORY,
  RoomAlreadyInactiveError,
  RoomNotFoundError,
} from '@/domain/room';

@Injectable()
export class DeleteRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const room = await this.roomRepository.findById(id);

    if (!room) {
      throw new RoomNotFoundError(id);
    }

    if (!room.isActive) {
      throw new RoomAlreadyInactiveError(id);
    }

    room.deactivate();

    await this.roomRepository.save(room);
  }
}
