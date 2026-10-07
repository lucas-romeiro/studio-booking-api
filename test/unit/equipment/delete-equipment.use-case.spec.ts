/* eslint-disable @typescript-eslint/unbound-method */
import { DeleteEquipmentUseCase } from '@/application/equipment';
import { mockEquipmentRepository } from '../../__mocks__';
import { EquipmentFactory } from '../../__factories__';
import {
  EquipmentAlreadyInactiveError,
  EquipmentNotFoundError,
} from '@/domain/equipment';

describe('DeleteEquipmentUseCase', () => {
  let useCase: DeleteEquipmentUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteEquipmentUseCase(mockEquipmentRepository);
  });

  it('should successfully deactivate an active equipment', async () => {
    const equipment = EquipmentFactory.make();
    mockEquipmentRepository.findById.mockResolvedValue(equipment);

    await useCase.execute(equipment.id);

    expect(mockEquipmentRepository.findById).toHaveBeenCalledWith(equipment.id);
    expect(equipment.isActive).toBe(false);
    expect(mockEquipmentRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEquipmentRepository.save).toHaveBeenCalledWith(equipment);
  });

  it('should throw EquipmentNotFoundError if equipment does not exist', async () => {
    const invalidId = 'invalid-id';
    mockEquipmentRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(invalidId)).rejects.toThrow(
      EquipmentNotFoundError,
    );
    await expect(useCase.execute(invalidId)).rejects.toThrow(
      new EquipmentNotFoundError(invalidId).message,
    );

    expect(mockEquipmentRepository.save).not.toHaveBeenCalled();
  });

  it('should throw EquipmentAlreadyInactiveError if equipment is already inactive', async () => {
    const equipment = EquipmentFactory.makeInactive();
    mockEquipmentRepository.findById.mockResolvedValue(equipment);

    await expect(useCase.execute(equipment.id)).rejects.toThrow(
      new EquipmentAlreadyInactiveError(equipment.id).message,
    );

    expect(mockEquipmentRepository.save).not.toHaveBeenCalled();
  });
});
