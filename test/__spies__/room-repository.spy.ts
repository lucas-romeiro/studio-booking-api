import { IRoomRepository, Room, SearchRoomsFilter } from '@/domain/room';

export class InMemoryRoomRepository implements IRoomRepository {
  public rooms: Room[] = [];

  async save(room: Room): Promise<void> {
    const index = this.rooms.findIndex((r) => r.id === room.id);
    if (index >= 0) {
      this.rooms[index] = room;
    } else {
      this.rooms.push(room);
    }

    return Promise.resolve();
  }

  async findById(id: string): Promise<Room | null> {
    const room = this.rooms.find((r) => r.id === id) ?? null;
    return Promise.resolve(room);
  }

  async findAll(filter?: SearchRoomsFilter): Promise<[Room[], number]> {
    const rooms = this.rooms.filter((r) => {
      if (filter?.type && r.type !== filter.type) {
        return false;
      }

      if (filter?.minCapacity && r.capacity < filter.minCapacity) {
        return false;
      }

      if (
        filter?.maxPricePerHour &&
        r.pricePerHour.amount > filter.maxPricePerHour
      ) {
        return false;
      }

      return true;
    });

    const total = rooms.length;
    const skip = filter?.skip ?? 0;
    const limit = filter?.limit ?? 10;
    const result = rooms.slice(skip, skip + limit);

    return Promise.resolve([result, total]);
  }

  async exists(id: string): Promise<boolean> {
    const room = this.rooms.some((r) => r.id === id);
    return Promise.resolve(room);
  }

  async delete(id: string): Promise<void> {
    const room = this.rooms.find((r) => r.id === id)!;
    if (room) room.deactivate();
    await Promise.resolve();
  }
}
