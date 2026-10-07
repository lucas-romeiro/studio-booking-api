import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserOrmEntity } from '../typeorm';
import { UserRole } from '@/domain/user';
import { seedConfig } from './seed-config';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(UserOrmEntity);

  const existing = await repo.findOneBy({ email: seedConfig.admin.email });
  if (existing) {
    console.log('· Users already seeded, skipping');
    return;
  }

  await repo.save([
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Admin Studio',
      email: seedConfig.admin.email,
      passwordHash: await bcrypt.hash(seedConfig.admin.password, 10),
      role: UserRole.ADMIN,
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Carlos Staff',
      email: seedConfig.staff.email,
      passwordHash: await bcrypt.hash(seedConfig.staff.password, 10),
      role: UserRole.STAFF,
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'João Músico',
      email: seedConfig.musician.email,
      passwordHash: await bcrypt.hash(seedConfig.musician.password, 10),
      role: UserRole.MUSICIAN,
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Pedro Eventos',
      email: seedConfig.renter.email,
      passwordHash: await bcrypt.hash(seedConfig.renter.password, 10),
      role: UserRole.RENTER,
    },
  ]);

  console.log('✓ Users seeded');
}
