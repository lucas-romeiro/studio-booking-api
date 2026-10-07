import { DataSource } from 'typeorm';
import { RoomOrmEntity } from '../typeorm';
import { RoomType } from '@/domain/room';

export async function seedRooms(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(RoomOrmEntity);

  const existing = await repo.findOneBy({ name: 'Sala A' });
  if (existing) {
    console.log('· Rooms already seeded, skipping');
    return;
  }

  await repo.save([
    {
      id: '00000000-0000-0000-0001-000000000001',
      name: 'Sala A',
      description: 'Sala de ensaio com bateria e amplificadores',
      type: RoomType.REHEARSAL,
      capacity: 8,
      pricePerHour: 50.0,
      currency: 'BRL',
      operatingHours: {
        monday: { open: '08:00', close: '22:00' },
        tuesday: { open: '08:00', close: '22:00' },
        wednesday: { open: '08:00', close: '22:00' },
        thursday: { open: '08:00', close: '22:00' },
        friday: { open: '08:00', close: '22:00' },
        saturday: { open: '09:00', close: '18:00' },
      },
    },
    {
      id: '00000000-0000-0000-0001-000000000002',
      name: 'Sala B',
      description: 'Sala de gravação com isolamento acústico',
      type: RoomType.RECORDING,
      capacity: 4,
      pricePerHour: 120.0,
      currency: 'BRL',
      operatingHours: {
        monday: { open: '09:00', close: '21:00' },
        tuesday: { open: '09:00', close: '21:00' },
        wednesday: { open: '09:00', close: '21:00' },
        thursday: { open: '09:00', close: '21:00' },
        friday: { open: '09:00', close: '21:00' },
        saturday: { open: '10:00', close: '16:00' },
      },
    },
    {
      id: '00000000-0000-0000-0001-000000000003',
      name: 'Sala C',
      description: 'Sala multiuso para ensaio e gravação',
      type: RoomType.BOTH,
      capacity: 6,
      pricePerHour: 80.0,
      currency: 'BRL',
      operatingHours: {
        monday: { open: '08:00', close: '22:00' },
        tuesday: { open: '08:00', close: '22:00' },
        wednesday: { open: '08:00', close: '22:00' },
        thursday: { open: '08:00', close: '22:00' },
        friday: { open: '08:00', close: '22:00' },
        saturday: { open: '09:00', close: '18:00' },
        sunday: { open: '10:00', close: '16:00' },
      },
    },
  ]);

  console.log('✓ Rooms seeded');
}
