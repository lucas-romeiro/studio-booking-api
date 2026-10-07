import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { seedUsers } from './user.seed';
import { seedRooms } from './room.seed';
import { seedEquipment } from './equipment.seed';

async function run(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('Database connected — running seeds...\n');

    await seedUsers(AppDataSource);
    await seedRooms(AppDataSource);
    await seedEquipment(AppDataSource);

    console.log('\n✓ All seeds completed');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

run().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
