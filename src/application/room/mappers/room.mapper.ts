import { Room } from '../../../domain/room';
import { RoomResponseDto } from '../dtos/room-response.dto';

export class RoomMapper {
  static toResponse(room: Room): RoomResponseDto {
    return {
      id: room.id,
      name: room.name,
      description: room.description,
      type: room.type,
      capacity: room.capacity,
      pricePerHour: room.pricePerHour.amount,
      currency: room.pricePerHour.currency,
      operatingHours: room.operatingHours.toJSON(),
      createdAt: room.createdAt,
    };
  }
}
