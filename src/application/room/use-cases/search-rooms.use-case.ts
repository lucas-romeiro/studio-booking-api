import { Inject, Injectable } from '@nestjs/common';
import {
  IRoomRepository,
  ROOM_REPOSITORY,
  SearchRoomsFilter,
} from '@/domain/room';
import { RoomResponseDto } from '../dtos/room-response.dto';
import { RoomMapper } from '../mappers/room.mapper';

@Injectable()
export class SearchRoomsUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(filter?: SearchRoomsFilter): Promise<RoomResponseDto[]> {
    const rooms = await this.roomRepository.findAll(filter);
    return rooms.map((room) => RoomMapper.toResponse(room));
  }
}
