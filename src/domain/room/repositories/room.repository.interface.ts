import { PaginationDto } from '@/shared';
import { Room } from '../entities/room.entity';
import { RoomType } from '../value-objects/room-type.vo';

export const ROOM_REPOSITORY = Symbol('IRoomRepository');

export interface SearchRoomsFilter extends PaginationDto {
  type?: RoomType;
  minCapacity?: number;
  maxPricePerHour?: number;
}

export interface IRoomRepository {
  save(room: Room): Promise<void>;
  findById(id: string): Promise<Room | null>;
  findAll(filter?: SearchRoomsFilter): Promise<[Room[], number]>;
  exists(id: string): Promise<boolean>;
  delete(id: string): Promise<void>;
}
