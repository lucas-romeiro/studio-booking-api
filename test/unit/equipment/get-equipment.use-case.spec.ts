/* eslint-disable @typescript-eslint/unbound-method */
import { GetEquipmentUseCase } from '@/application/equipment';
import { mockEquipmentRepository } from '../../__mocks__';
import { EquipmentFactory } from '../../__factories__';
import { EquipmentNotFoundError } from '@/domain/equipment';

describe('GetEquipmentUseCase', () => {
  let useCase: GetEquipmentUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetEquipmentUseCase(mockEquipmentRepository);
  });

  describe('Find Flow', () => {
    it('should return an equipment responde DTO when equipment exists', async () => {
      const equipment = EquipmentFactory.make();
      mockEquipmentRepository.findById.mockResolvedValue(equipment);

      const response = await useCase.execute(equipment.id);

      expect(mockEquipmentRepository.findById).toHaveBeenCalledWith(
        equipment.id,
      );
      expect(mockEquipmentRepository.findById).toHaveBeenCalledTimes(1);
      expect(response).toBeDefined();
      expect(response.id).toBe(equipment.id);
      expect(response.name).toBe(equipment.name);
    });

    it('should throw EquipmentNotFoundError when equipment does not exist', async () => {
      const invalidId = 'invalid-id';
      mockEquipmentRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(invalidId)).rejects.toThrow(
        EquipmentNotFoundError,
      );
      await expect(useCase.execute(invalidId)).rejects.toThrow(
        new EquipmentNotFoundError(invalidId).message,
      );
    });
  });
});
