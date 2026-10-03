import { Inject, Injectable } from '@nestjs/common';
import {
  IRoomRepository,
  Money,
  OperatingHours,
  ROOM_REPOSITORY,
  RoomNotFoundError,
} from '@/domain/room';
import { UpdateRoomDto } from '../dtos/update-room.dto';
import { RoomResponseDto } from '../dtos/room-response.dto';
import { RoomMapper } from '../mappers/room.mapper';

@Injectable()
export class UpdateRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(id: string, dto: UpdateRoomDto): Promise<RoomResponseDto> {
    const room = await this.roomRepository.findById(id);

    if (!room) {
      throw new RoomNotFoundError(id);
    }

    room.update({
      name: dto.name,
      description: dto.description,
      capacity: dto.capacity,
      pricePerHour:
        dto.pricePerHour !== undefined
          ? new Money(dto.pricePerHour)
          : undefined,
      operatingHours:
        dto.operatingHours !== undefined
          ? new OperatingHours(dto.operatingHours)
          : undefined,
    });

    await this.roomRepository.save(room);

    return RoomMapper.toResponse(room);
  }
}
