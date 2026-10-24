/* eslint-disable @typescript-eslint/unbound-method */
import {
  ListRoomBookingsUseCase,
  RoomBookingMapper,
  SearchRoomBookingsDto,
} from '@/application/booking';
import { TokenPayload } from '@/domain/auth';
import { mockRoomBookingRepository } from '../../__mocks__';
import { UserRole } from '@/domain/user';
import { RoomBookingFactory } from '../../__factories__';
import { futureDate } from '../../helpers';

describe('ListRoomBookingsUseCase', () => {
  let useCase: ListRoomBookingsUseCase;
  let currentUser: TokenPayload;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ListRoomBookingsUseCase(mockRoomBookingRepository);
    currentUser = {
      sub: crypto.randomUUID(),
      role: UserRole.ADMIN,
      email: 'jhondoe@email.com',
    };
  });

  const createDefaultDto = (
    overrides?: Partial<SearchRoomBookingsDto>,
  ): SearchRoomBookingsDto => {
    const dto = new SearchRoomBookingsDto();
    dto.page = 1;
    dto.limit = 10;
    Object.assign(dto, overrides);
    return dto;
  };

  describe('Authorization and Filtering Flow', () => {
    it('should force userId to currentUser.sub if user is a standard musician', async () => {
      const booking = RoomBookingFactory.make();
      mockRoomBookingRepository.findAll.mockResolvedValue([[booking], 1]);

      currentUser.role = UserRole.MUSICIAN;
      currentUser.sub = 'client-user-id';

      const dto = createDefaultDto({ userId: 'some-other-user-id' });

      await useCase.execute(dto, currentUser);

      expect(mockRoomBookingRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'client-user-id',
          skip: 0,
        }),
      );
    });

    it('should allow staff or admin to filter by dto.userId', async () => {
      const booking = RoomBookingFactory.make();
      mockRoomBookingRepository.findAll.mockResolvedValue([[booking], 1]);

      currentUser.role = UserRole.STAFF;

      const dto = createDefaultDto({ userId: 'target-client-id' });

      await useCase.execute(dto, currentUser);

      expect(mockRoomBookingRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'target-client-id',
        }),
      );
    });
  });

  describe('Pagination Flow', () => {
    it('should parse string dates to Date objects and return a paginated response', async () => {
      const booking = RoomBookingFactory.make();
      mockRoomBookingRepository.findAll.mockResolvedValue([[booking], 1]);

      const dto = createDefaultDto({
        page: 1,
        limit: 10,
        startDate: futureDate(1).toISOString(),
        endDate: futureDate(2).toISOString(),
      });

      const result = await useCase.execute(dto, currentUser);

      expect(mockRoomBookingRepository.findAll).toHaveBeenCalledWith(
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
        data: [RoomBookingMapper.toResponse(booking)],
      });
    });
  });
});
