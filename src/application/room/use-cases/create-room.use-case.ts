import { Inject, Injectable } from '@nestjs/common';
import {
  IRoomRepository,
  Money,
  OperatingHours,
  Room,
  ROOM_REPOSITORY,
} from '@/domain/room';
import { CreateRoomDto } from '../dtos/create-room.dto';
import { RoomResponseDto } from '../dtos/room-response.dto';
import { RoomMapper } from '../mappers/room.mapper';

@Injectable()
export class CreateRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(dto: CreateRoomDto): Promise<RoomResponseDto> {
    const room = Room.create({
      name: dto.name,
      description: dto.description,
      type: dto.type,
      capacity: dto.capacity,
      pricePerHour: new Money(dto.pricePerHour),
      operatingHours: new OperatingHours(dto.operatingHours),
    });

    await this.roomRepository.save(room);

    return RoomMapper.toResponse(room);
  }
}
