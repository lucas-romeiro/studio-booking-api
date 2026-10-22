import { Injectable } from '@nestjs/common';
import {
  EquipmentRental,
  IEquipmentRentalRepository,
  RentalStatus,
  SearchEquipmentRentalsFilter,
} from '@/domain/booking';
import { InjectRepository } from '@nestjs/typeorm';
import { EquipmentRentalOrmEntity } from '../entities/equipment-rental.orm-entity';
import { Not, Repository } from 'typeorm';
import { EquipmentRentalOrmMapper } from '../mappers/equipment-rental.mapper';

@Injectable()
export class EquipmentRentalTypeOrmRepository implements IEquipmentRentalRepository {
  constructor(
    @InjectRepository(EquipmentRentalOrmEntity)
    private readonly repo: Repository<EquipmentRentalOrmEntity>,
  ) {}

  async save(rental: EquipmentRental): Promise<void> {
    await this.repo.save(EquipmentRentalOrmMapper.toOrm(rental));
  }
  async findById(id: string): Promise<EquipmentRental | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? EquipmentRentalOrmMapper.toDomain(orm) : null;
  }
  async findAll(
    filter?: SearchEquipmentRentalsFilter,
  ): Promise<[EquipmentRental[], number]> {
    const qb = this.repo.createQueryBuilder('rental');

    if (filter?.userId) {
      qb.andWhere('rental.userId = :userId', { userId: filter.userId });
    }
    if (filter?.equipmentId) {
      qb.andWhere('rental.equipmentId = :equipmentId', {
        equipmentId: filter.equipmentId,
      });
    }
    if (filter?.status) {
      qb.andWhere('rental.status = :status', { status: filter.status });
    }
    if (filter?.startDate) {
      qb.andWhere('rental.startDate = :startDate', {
        startDate: filter.startDate,
      });
    }
    if (filter?.endDate) {
      qb.andWhere('rental.endDate = :endDate', { endDate: filter.endDate });
    }

    qb.orderBy(
      `rental.${filter?.orderBy ?? 'createdAt'}`,
      filter?.order ?? 'DESC',
    )
      .skip(filter?.skip ?? 0)
      .take(filter?.limit ?? 10);

    const [orms, total] = await qb.getManyAndCount();

    return [orms.map((r) => EquipmentRentalOrmMapper.toDomain(r)), total];
  }
  async findActiveByEquipmentId(
    equipmentId: string,
  ): Promise<EquipmentRental[]> {
    const orms = await this.repo.find({
      where: {
        equipmentId,
        status: Not(RentalStatus.CANCELLED),
      },
    });

    return orms.map((r) => EquipmentRentalOrmMapper.toDomain(r));
  }
  async exists(id: string): Promise<boolean> {
    return this.repo.existsBy({ id });
  }
}
