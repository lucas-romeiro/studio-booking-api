import { Column, Entity } from 'typeorm';
import { BaseOrmEntity } from './base.orm-entity';
import { EquipmentCategory } from '@/domain/equipment';

@Entity('equipment')
export class EquipmentOrmEntity extends BaseOrmEntity {
  @Column()
  name!: string;

  @Column({ nullable: true, type: 'text' })
  description!: string | null;

  @Column({ type: 'enum', enum: EquipmentCategory })
  category!: EquipmentCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerDay!: number;

  @Column({ default: 'BRL' })
  currency!: string;

  @Column()
  totalStock!: number;

  @Column()
  availableStock!: number;
}
