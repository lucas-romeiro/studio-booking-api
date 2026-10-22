/* eslint-disable @typescript-eslint/unbound-method */
import { ReturnEquipmentRentalUseCase } from '@/application/booking';
import {
  mockEquipmentRentalRepository,
  mockEquipmentRepository,
} from '../../__mocks__';
import { EquipmentFactory, EquipmentRentalFactory } from '../../__factories__';
import { EquipmentRentalNotFoundError, RentalStatus } from '@/domain/booking';

describe('ReturnEquipmentRentalUseCase', () => {
  let useCase: ReturnEquipmentRentalUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ReturnEquipmentRentalUseCase(
      mockEquipmentRentalRepository,
      mockEquipmentRepository,
    );
  });

  describe('Return Flow', () => {
    it('should return a rental and realse equipment successfully', async () => {
      const equipment = EquipmentFactory.makeUnavailable();
      const rental = EquipmentRentalFactory.makeConfirmed({
        equipmentId: equipment.id,
      });
      mockEquipmentRentalRepository.findById.mockResolvedValue(rental);
      mockEquipmentRepository.findById.mockResolvedValue(equipment);

      const result = await useCase.execute(rental.id);

      expect(result.status).toBe(RentalStatus.RETURNED);
      expect(equipment.isAvailable).toBe(true);
      expect(mockEquipmentRentalRepository.findById).toHaveBeenCalledWith(
        rental.id,
      );
      expect(mockEquipmentRepository.findById).toHaveBeenCalledWith(
        rental.equipmentId,
      );
      expect(mockEquipmentRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEquipmentRepository.save).toHaveBeenCalledWith(equipment);
      expect(mockEquipmentRentalRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEquipmentRentalRepository.save).toHaveBeenCalledWith(rental);
    });

    it('should return a rental successfully even if equipment is not found in repository', async () => {
      const rental = EquipmentRentalFactory.makeConfirmed();

      mockEquipmentRentalRepository.findById.mockResolvedValue(rental);
      mockEquipmentRepository.findById.mockResolvedValue(null);

      const result = await useCase.execute(rental.id);

      expect(result.status).toBe(RentalStatus.RETURNED);
      expect(mockEquipmentRepository.save).not.toHaveBeenCalled();
      expect(mockEquipmentRentalRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validation Flow', () => {
    it('should throw EquipmentRentalNotFoundError when rental does not exist', async () => {
      const invalidId = 'invalid-id';
      mockEquipmentRentalRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(invalidId)).rejects.toThrow(
        new EquipmentRentalNotFoundError(invalidId),
      );
      expect(mockEquipmentRepository.findById).not.toHaveBeenCalled();
      expect(mockEquipmentRentalRepository.save).not.toHaveBeenCalled();
      expect(mockEquipmentRepository.save).not.toHaveBeenCalled();
    });
  });
});
