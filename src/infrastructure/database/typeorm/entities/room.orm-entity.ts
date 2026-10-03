import { Column, Entity } from 'typeorm';
import { BaseOrmEntity } from './base.orm-entity';
import { RoomType } from '@/domain/room';

@Entity('rooms')
export class RoomOrmEntity extends BaseOrmEntity {
  @Column()
  name!: string;

  @Column({ nullable: true, type: 'text' })
  description?: string | null;

  @Column({ type: 'enum', enum: RoomType })
  type!: RoomType;

  @Column()
  capacity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerHour!: number;

  @Column({ default: 'BRL' })
  currency!: string;

  @Column({ type: 'jsonb' })
  operatingHours!: object;
}
