import { Column, Entity } from 'typeorm';
import { BaseOrmEntity } from './base.orm-entity';

@Entity('refresh-tokens')
export class RefreshTokenOrmEntity extends BaseOrmEntity {
  @Column()
  userId!: string;

  @Column({ unique: true })
  token!: string;

  @Column()
  expiresAt!: Date;
}
