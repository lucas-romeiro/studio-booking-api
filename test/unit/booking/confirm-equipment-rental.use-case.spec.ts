/* eslint-disable @typescript-eslint/unbound-method */
import { ConfirmEquipmentRentalUseCase } from '@/application/booking';
import { mockEquipmentRentalRepository } from '../../__mocks__';
import { EquipmentRentalFactory } from '../../__factories__';
import { EquipmentRentalNotFoundError, RentalStatus } from '@/domain/booking';

describe('ConfirmEquipmentRentalUseCase', () => {
  let useCase: ConfirmEquipmentRentalUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ConfirmEquipmentRentalUseCase(mockEquipmentRentalRepository);
  });

  describe('Confirmation Flow', () => {
    it('should confirm a rental successfully', async () => {
      const rental = EquipmentRentalFactory.make();
      mockEquipmentRentalRepository.findById.mockResolvedValue(rental);

      const result = await useCase.execute(rental.id);

      expect(result.status).toBe(RentalStatus.CONFIRMED);
      expect(mockEquipmentRentalRepository.findById).toHaveBeenCalledWith(
        rental.id,
      );
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
      expect(mockEquipmentRentalRepository.save).not.toHaveBeenCalled();
    });
  });
});
