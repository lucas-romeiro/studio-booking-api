import { Injectable } from '@nestjs/common';
import {
  Equipment,
  IEquipmentRepository,
  SearchEquipmentFilter,
} from '@/domain/equipment';
import { EquipmentOrmEntity } from '../entities/equipment.orm-entity';
import {
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThan,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EquipmentOrmMapper } from '../mappers/equipment.mapper';

@Injectable()
export class EquipmentTypeOrmRepository implements IEquipmentRepository {
  constructor(
    @InjectRepository(EquipmentOrmEntity)
    private readonly repo: Repository<EquipmentOrmEntity>,
  ) {}

  async save(equipment: Equipment): Promise<void> {
    const orm = EquipmentOrmMapper.toOrm(equipment);
    await this.repo.save(orm);
  }

  async findById(id: string): Promise<Equipment | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? EquipmentOrmMapper.toDomain(orm) : null;
  }

  async findAll(
    filter?: SearchEquipmentFilter,
  ): Promise<[Equipment[], number]> {
    const where: FindOptionsWhere<EquipmentOrmEntity> = {};

    if (filter?.category) {
      where.category = filter.category;
    }

    if (filter?.maxPricePerDay) {
      where.pricePerDay = LessThanOrEqual(filter.maxPricePerDay);
    }

    if (filter?.available) {
      where.availableStock = MoreThan(0);
    }

    const [orms, total] = await this.repo.findAndCount({
      where,
      order: {
        [filter?.orderBy ?? 'createdAt']: filter?.order ?? 'DESC',
      },
      skip: filter?.skip ?? 0,
      take: filter?.limit ?? 10,
    });

    const equipments = orms
      .filter((orm) => !filter?.available || orm.availableStock > 0)
      .map((orm) => EquipmentOrmMapper.toDomain(orm));

    return [equipments, total];
  }

  async exists(id: string): Promise<boolean> {
    return this.repo.existsBy({ id });
  }
}
