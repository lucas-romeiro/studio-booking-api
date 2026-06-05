import { UserRole } from '@/domain/user';
import { Column, Entity } from 'typeorm';
import { BaseOrmEntity } from './base.orm-entity';

@Entity('users')
export class UserOrmEntity extends BaseOrmEntity {
  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MUSICIAN })
  role!: UserRole;
}
