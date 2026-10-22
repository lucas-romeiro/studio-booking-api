/* eslint-disable @typescript-eslint/unbound-method */
import { CancelEquipmentRentalUseCase } from '@/application/booking';
import { TokenPayload } from '@/domain/auth';
import {
  mockEquipmentRentalRepository,
  mockEquipmentRepository,
} from '../../__mocks__';
import { UserRole } from '@/domain/user';
import { EquipmentFactory, EquipmentRentalFactory } from '../../__factories__';
import {
  EquipmentRentalNotFoundError,
  RentalStatus,
  UnauthorizedBookingError,
} from '@/domain/booking';

describe('CancelEquipmentRentalUseCase', () => {
  let useCase: CancelEquipmentRentalUseCase;
  let currentUser: TokenPayload;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CancelEquipmentRentalUseCase(
      mockEquipmentRentalRepository,
      mockEquipmentRepository,
    );
    currentUser = {
      sub: crypto.randomUUID(),
      email: 'jhondoe@email.com',
      role: UserRole.ADMIN,
    };
  });

  describe('Cancel Flow', () => {
    it('should cancel a rental  successfully', async () => {
      const equipment = EquipmentFactory.make();
      const rental = EquipmentRentalFactory.makeConfirmed({
        equipmentId: equipment.id,
      });
      mockEquipmentRentalRepository.findById.mockResolvedValue(rental);

      await useCase.execute(rental.id, currentUser);

      expect(rental.status).toBe(RentalStatus.CANCELLED);
      expect(mockEquipmentRentalRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should cancel a rental successfully as the owner (renter)', async () => {
      currentUser.role = UserRole.RENTER;
      const rental = EquipmentRentalFactory.makeConfirmed({
        userId: currentUser.sub,
      });
      mockEquipmentRentalRepository.findById.mockResolvedValue(rental);

      await useCase.execute(rental.equipmentId, currentUser);

      expect(rental.status).toBe(RentalStatus.CANCELLED);
      expect(mockEquipmentRentalRepository.save).toHaveBeenCalledWith(rental);
    });
  });

  describe('Validation Flow', () => {
    it('should throw EquipmentRentalNotFoundError if rental does not exist', async () => {
      const invalidId = 'invalid-id';
      mockEquipmentRentalRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(invalidId, currentUser)).rejects.toThrow(
        new EquipmentRentalNotFoundError(invalidId),
      );
      expect(mockEquipmentRentalRepository.findById).toHaveBeenCalledWith(
        invalidId,
      );
      expect(mockEquipmentRentalRepository.save).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedBookingError if user  is not allowed', async () => {
      currentUser.role = UserRole.MUSICIAN;
      const rental = EquipmentRentalFactory.makeConfirmed();
      mockEquipmentRentalRepository.findById.mockResolvedValue(rental);

      await expect(
        useCase.execute(rental.id, currentUser),
      ).rejects.toBeInstanceOf(UnauthorizedBookingError);
      expect(mockEquipmentRentalRepository.findById).toHaveBeenCalledWith(
        rental.id,
      );
      expect(mockEquipmentRentalRepository.save).not.toHaveBeenCalled();
    });
  });
});
