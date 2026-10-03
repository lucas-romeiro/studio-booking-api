import { Inject, Injectable } from '@nestjs/common';
import {
  IRoomRepository,
  ROOM_REPOSITORY,
  RoomNotFoundError,
} from '@/domain/room';
import { RoomResponseDto } from '../dtos/room-response.dto';
import { RoomMapper } from '../mappers/room.mapper';

@Injectable()
export class GetRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(id: string): Promise<RoomResponseDto> {
    const room = await this.roomRepository.findById(id);

    if (!room) {
      throw new RoomNotFoundError(id);
    }

    return RoomMapper.toResponse(room);
  }
}
