/* eslint-disable @typescript-eslint/unbound-method */
import {
  EquipmentRentalMapper,
  ListEquipmentRentalsUseCase,
  SearchEquipmentRentalsDto,
} from '@/application/booking';
import { mockEquipmentRentalRepository } from '../../__mocks__';
import { TokenPayload } from '@/domain/auth';
import { UserRole } from '@/domain/user';
import { EquipmentRentalFactory } from '../../__factories__';

describe('ListEquipmentRentalsUseCase', () => {
  let useCase: ListEquipmentRentalsUseCase;
  let currentUser: TokenPayload;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ListEquipmentRentalsUseCase(mockEquipmentRentalRepository);
    currentUser = {
      sub: crypto.randomUUID(),
      email: 'jhondoe@email.com',
      role: UserRole.ADMIN,
    };
  });

  const createDefaultDto = (
    overrides?: Partial<SearchEquipmentRentalsDto>,
  ): SearchEquipmentRentalsDto => {
    const dto = new SearchEquipmentRentalsDto();
    dto.page = 1;
    dto.limit = 10;
    Object.assign(dto, overrides);
    return dto;
  };

  const futureDate = (daysFromNow: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString();
  };

  describe('Authorization and Filtering Flow', () => {
    it('should force userId to currentUser.sub if user is a standard renter', async () => {
      const rental = EquipmentRentalFactory.make();
      mockEquipmentRentalRepository.findAll.mockResolvedValue([[rental], 1]);

      currentUser.role = UserRole.RENTER;
      currentUser.sub = 'client-user-id';

      const dto = createDefaultDto({ userId: 'some-other-user-id' });

      const result = await useCase.execute(dto, currentUser);

      expect(result).toBeDefined();
      expect(mockEquipmentRentalRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'client-user-id',
          skip: 0,
        }),
      );
    });

    it('should allow staff or admin to filter by dto.userId', async () => {
      const rental = EquipmentRentalFactory.make();
      mockEquipmentRentalRepository.findAll.mockResolvedValue([[rental], 1]);

      const dto = createDefaultDto({ userId: 'target-client-id' });

      await useCase.execute(dto, currentUser);

      expect(mockEquipmentRentalRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'target-client-id',
        }),
      );
    });
  });

  describe('Pagination Flow', () => {
    it('should parse string dates to Date objects and return a paginated response', async () => {
      const rental = EquipmentRentalFactory.make();
      mockEquipmentRentalRepository.findAll.mockResolvedValue([[rental], 1]);

      const dto = createDefaultDto({
        page: 1,
        limit: 10,
        startDate: futureDate(1),
        endDate: futureDate(2),
      });

      const result = await useCase.execute(dto, currentUser);

      expect(mockEquipmentRentalRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          startDate: new Date(String(dto.startDate)),
          endDate: new Date(String(dto.endDate)),
        }),
      );

      expect(result).toEqual({
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
        data: [EquipmentRentalMapper.toResponse(rental)],
      });
    });
  });
});
