/* eslint-disable @typescript-eslint/unbound-method */
import {
  CreateEquipmentRentalDto,
  CreateEquipmentRentalUseCase,
} from '@/application/booking';
import { TokenPayload } from '@/domain/auth';
import {
  mockEquipmentRentalRepository,
  mockEquipmentRepository,
} from '../../__mocks__';
import { UserRole } from '@/domain/user';
import { EquipmentFactory } from '../../__factories__';
import {
  EquipmentNotFoundError,
  EquipmentNotAvailableError,
} from '@/domain/equipment';

describe('CreateEquipmentRentalUseCase', () => {
  let useCase: CreateEquipmentRentalUseCase;
  let dto: CreateEquipmentRentalDto;
  let currentUser: TokenPayload;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateEquipmentRentalUseCase(
      mockEquipmentRentalRepository,
      mockEquipmentRepository,
    );
    dto = {
      equipmentId: crypto.randomUUID(),
      quantity: 1,
      startDate: futureDate(1),
      endDate: futureDate(2),
    };
    currentUser = {
      sub: crypto.randomUUID(),
      email: 'johndoe@email.com',
      role: UserRole.ADMIN,
    };
  });

  const futureDate = (daysFromNow: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString();
  };

  describe('Creation Flow', () => {
    it('should create a rental with pending status successfully', async () => {
      const equipment = EquipmentFactory.make({
        id: dto.equipmentId,
        totalStock: 5,
      });
      mockEquipmentRepository.findById.mockResolvedValue(equipment);
      mockEquipmentRentalRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute(dto, currentUser);

      expect(result.equipmentId).toBe(equipment.id);
      expect(result.userId).toBe(currentUser.sub);
      expect(mockEquipmentRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockEquipmentRentalRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('Validation Flow', () => {
    it('should throw a EquipmentNotFoundError if the equipment does not exist', async () => {
      mockEquipmentRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(dto, currentUser)).rejects.toThrow(
        new EquipmentNotFoundError(dto.equipmentId),
      );
      expect(mockEquipmentRentalRepository.save).not.toHaveBeenCalled();
    });

    it('should throw a EquipmentNotAvailableError if the equipment is out of stock', async () => {
      const equipment = EquipmentFactory.makeUnavailable();
      mockEquipmentRepository.findById.mockResolvedValue(equipment);

      await expect(useCase.execute(dto, currentUser)).rejects.toThrow(
        new EquipmentNotAvailableError(dto.equipmentId),
      );
      expect(mockEquipmentRentalRepository.save).not.toHaveBeenCalled();
    });
  });
});
