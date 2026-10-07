import { DataSource } from 'typeorm';
import { EquipmentOrmEntity } from '../typeorm';
import { EquipmentCategory } from '@/domain/equipment';

export async function seedEquipment(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(EquipmentOrmEntity);

  const existing = await repo.findOneBy({ name: 'Marshall JCM800' });
  if (existing) {
    console.log('· Equipment already seeded, skipping');
    return;
  }

  await repo.save([
    {
      id: '00000000-0000-0000-0002-000000000001',
      name: 'Marshall JCM800',
      description: 'Amplificador valvulado 100W',
      category: EquipmentCategory.GUITAR_AMP,
      pricePerDay: 150.0,
      currency: 'BRL',
      totalStock: 2,
      availableStock: 2,
    },
    {
      id: '00000000-0000-0000-0002-000000000002',
      name: 'Ampeg SVT-CL',
      description: 'Amplificador de baixo valvulado 300W',
      category: EquipmentCategory.BASS_AMP,
      pricePerDay: 180.0,
      currency: 'BRL',
      totalStock: 2,
      availableStock: 2,
    },
    {
      id: '00000000-0000-0000-0002-000000000003',
      name: 'Pearl Export',
      description: 'Bateria acústica completa com pratos',
      category: EquipmentCategory.DRUMS,
      pricePerDay: 200.0,
      currency: 'BRL',
      totalStock: 1,
      availableStock: 1,
    },
    {
      id: '00000000-0000-0000-0002-000000000004',
      name: 'Shure SM58',
      description: 'Microfone dinâmico vocal',
      category: EquipmentCategory.MICROPHONE,
      pricePerDay: 40.0,
      currency: 'BRL',
      totalStock: 6,
      availableStock: 6,
    },
    {
      id: '00000000-0000-0000-0002-000000000005',
      name: 'Yamaha MG16',
      description: 'Mesa de som 16 canais',
      category: EquipmentCategory.MIXER,
      pricePerDay: 120.0,
      currency: 'BRL',
      totalStock: 2,
      availableStock: 2,
    },
    {
      id: '00000000-0000-0000-0002-000000000006',
      name: 'Roland TD-17',
      description: 'Bateria eletrônica com módulo',
      category: EquipmentCategory.ELECTRONIC_DRUMS,
      pricePerDay: 160.0,
      currency: 'BRL',
      totalStock: 1,
      availableStock: 1,
    },
  ]);

  console.log('✓ Equipment seeded');
}
