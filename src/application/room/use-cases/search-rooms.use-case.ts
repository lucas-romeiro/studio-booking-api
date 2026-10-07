import { Inject, Injectable } from '@nestjs/common';
import { IRoomRepository, ROOM_REPOSITORY } from '@/domain/room';
import { RoomResponseDto } from '../dtos/room-response.dto';
import { RoomMapper } from '../mappers/room.mapper';
import { SearchRoomsDto } from '../dtos/search-rooms.dto';
import { paginate, PaginationResponse } from '@/shared';

@Injectable()
export class SearchRoomsUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(
    dto?: SearchRoomsDto,
  ): Promise<PaginationResponse<RoomResponseDto>> {
    const [rooms, total] = await this.roomRepository.findAll(dto);

    return paginate(
      rooms.map((room) => RoomMapper.toResponse(room)),
      total,
      dto?.page ?? 1,
      dto?.limit ?? 0,
    );
  }
}
