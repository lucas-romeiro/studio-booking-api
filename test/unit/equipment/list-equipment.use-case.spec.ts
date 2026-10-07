/* eslint-disable @typescript-eslint/unbound-method */
import {
  ListEquipmentDto,
  ListEquipmentUseCase,
} from '@/application/equipment';
import { mockEquipmentRepository } from '../../__mocks__';
import { EquipmentFactory } from '../../__factories__';
import { EquipmentCategory } from '@/domain/equipment';

describe('ListEquipmentUseCase', () => {
  let useCase: ListEquipmentUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ListEquipmentUseCase(mockEquipmentRepository);
  });

  it('should return an array of equipment response DTOs when equipments exist', async () => {
    const equipments = [
      EquipmentFactory.make({ id: 'equipment-1' }),
      EquipmentFactory.make({
        id: 'equipment-2',
        name: 'Drum Kit',
        category: EquipmentCategory.DRUMS,
        totalStock: 2,
        availableStock: 1,
      }),
    ];
    mockEquipmentRepository.findAll.mockResolvedValue([equipments, 2]);

    const response = await useCase.execute();

    expect(mockEquipmentRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockEquipmentRepository.findAll).toHaveBeenCalledWith(undefined);
    expect(response.data).toHaveLength(2);
    expect(response.meta.total).toEqual(2);
    expect(response.data[0].id).toBe('equipment-1');
    expect(response.data[0].name).toBe('Marshall JCM800');
    expect(response.data[1].id).toBe('equipment-2');
    expect(response.data[1].name).toBe('Drum Kit');
  });

  it('should pass filters to the repository and return filtered results', async () => {
    const equipments = [EquipmentFactory.make()];
    const filter = new ListEquipmentDto();
    filter.category = EquipmentCategory.OTHER;
    filter.available = true;

    mockEquipmentRepository.findAll.mockResolvedValue([equipments, 1]);

    const response = await useCase.execute(filter);

    expect(mockEquipmentRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockEquipmentRepository.findAll).toHaveBeenCalledWith(filter);
    expect(response.data).toHaveLength(1);
    expect(response.meta.total).toEqual(1);
    expect(response.data[0].name).toBe('Marshall JCM800');
  });

  it('should return an empty array when no equipment is found', async () => {
    mockEquipmentRepository.findAll.mockResolvedValue([[], 0]);

    const response = await useCase.execute();

    expect(mockEquipmentRepository.findAll).toHaveBeenCalledTimes(1);
    expect(response.data).toEqual([]);
    expect(response.meta.total).toEqual(0);
  });
});
