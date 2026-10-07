/* eslint-disable @typescript-eslint/unbound-method */
import { UpdateEquipmentUseCase } from '@/application/equipment';
import { EquipmentNotFoundError } from '@/domain/equipment';
import { Money } from '@/domain/room';
import { DomainError } from '@/domain/shared';
import { EquipmentFactory } from '../../__factories__';
import { mockEquipmentRepository } from '../../__mocks__';

describe('UpdateEquipmentUseCase', () => {
  let useCase: UpdateEquipmentUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateEquipmentUseCase(mockEquipmentRepository);
  });

  describe('Success Paths', () => {
    it('should successfully update equipment price and stock', async () => {
      const equipment = EquipmentFactory.make();
      mockEquipmentRepository.findById.mockResolvedValue(equipment);

      const updateDto = {
        pricePerDay: 200,
        totalStock: 8,
      };

      const response = await useCase.execute(equipment.id, updateDto);

      expect(response).toBeDefined();
      expect(mockEquipmentRepository.findById).toHaveBeenCalledWith(
        equipment.id,
      );
      expect(equipment.pricePerDay.equals(new Money(200))).toBe(true);
      expect(equipment.totalStock).toBe(8);
      expect(mockEquipmentRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEquipmentRepository.save).toHaveBeenCalledWith(equipment);
    });

    it('should update only price when stock is not provided', async () => {
      const equipement = EquipmentFactory.make();
      mockEquipmentRepository.findById.mockResolvedValue(equipement);

      const updateDto = {
        pricePerDay: 180,
      };

      await useCase.execute(equipement.id, updateDto);

      expect(equipement.pricePerDay.equals(new Money(180))).toBe(true);
      expect(equipement.totalStock).toBe(2);
      expect(mockEquipmentRepository.save).toHaveBeenCalledWith(equipement);
    });

    it('should update only stock when price is not provided', async () => {
      const equipement = EquipmentFactory.make();
      mockEquipmentRepository.findById.mockResolvedValue(equipement);

      const updateDto = {
        totalStock: 10,
      };

      await useCase.execute(equipement.id, updateDto);

      expect(equipement.totalStock).toBe(10);
      expect(equipement.pricePerDay.equals(new Money(150))).toBe(true);
      expect(mockEquipmentRepository.save).toHaveBeenCalledWith(equipement);
    });
  });

  describe('Error Paths', () => {
    it('should throw EquipmentNotFoundError if equiment does not exist', async () => {
      mockEquipmentRepository.findById.mockResolvedValue(null);

      const invalidId = 'invalid-id';
      const updateDto = {
        pricePerDay: 200,
      };

      await expect(useCase.execute(invalidId, updateDto)).rejects.toThrow(
        EquipmentNotFoundError,
      );
      await expect(useCase.execute(invalidId, updateDto)).rejects.toThrow(
        new EquipmentNotFoundError(invalidId).message,
      );
      expect(mockEquipmentRepository.save).not.toHaveBeenCalled();
    });

    it('should throw DomainError if trying to reduce stock below the reserved quantity', async () => {
      const equipment = EquipmentFactory.make();
      equipment.reserve(2);
      mockEquipmentRepository.findById.mockResolvedValue(equipment);

      const updateDto = {
        totalStock: 1,
      };

      await expect(useCase.execute(equipment.id, updateDto)).rejects.toThrow(
        DomainError,
      );
      await expect(useCase.execute(equipment.id, updateDto)).rejects.toThrow(
        'It is not possible to reduce stock below the reserved quantity: 2',
      );
      expect(mockEquipmentRepository.save).not.toHaveBeenCalled();
    });
  });
});
