import { Injectable } from '@nestjs/common';
import { IRoomRepository, Room, SearchRoomsFilter } from '@/domain/room';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomOrmEntity } from '../entities/room.orm-entity';
import { FindOptionsWhere, LessThanOrEqual, Repository } from 'typeorm';
import { RoomOrmMapper } from '../mappers/room.mapper';

@Injectable()
export class RoomTypeOrmRepository implements IRoomRepository {
  constructor(
    @InjectRepository(RoomOrmEntity)
    private readonly repo: Repository<RoomOrmEntity>,
  ) {}

  async save(room: Room): Promise<void> {
    const orm = RoomOrmMapper.toOrm(room);
    await this.repo.save(orm);
  }

  async findById(id: string): Promise<Room | null> {
    const orm = await this.repo.findOne({
      where: { id },
    });
    return orm ? RoomOrmMapper.toDomain(orm) : null;
  }

  async findAll(filter?: SearchRoomsFilter): Promise<Room[]> {
    const where: FindOptionsWhere<RoomOrmEntity> = {};

    if (filter?.type) {
      where.type = filter.type;
    }

    if (filter?.maxPricePerHour) {
      where.pricePerHour = LessThanOrEqual(filter.maxPricePerHour);
    }

    const orms = await this.repo.find({
      where,
    });

    return orms
      .filter(
        (orm) => !filter?.minCapacity || orm.capacity >= filter.minCapacity,
      )
      .map((room) => RoomOrmMapper.toDomain(room));
  }

  async exists(id: string): Promise<boolean> {
    return this.repo.existsBy({ id });
  }

  async delete(id: string): Promise<void> {
    await this.repo.softDelete({ id });
  }
}
