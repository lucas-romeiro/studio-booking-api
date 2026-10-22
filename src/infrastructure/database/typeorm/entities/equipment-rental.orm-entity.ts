import { Column, Entity } from 'typeorm';
import { BaseOrmEntity } from './base.orm-entity';
import { RentalStatus } from '@/domain/booking';

@Entity('equipment-rentals')
export class EquipmentRentalOrmEntity extends BaseOrmEntity {
  @Column()
  userId!: string;

  @Column()
  equipmentId!: string;

  @Column()
  quantity!: number;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({ default: 'BRL' })
  currency!: string;

  @Column({ type: 'enum', enum: RentalStatus, default: RentalStatus.PENDING })
  status!: RentalStatus;
}
