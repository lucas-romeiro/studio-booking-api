import { Inject, Injectable } from '@nestjs/common';
import {
  IRoomBookingRepository,
  ROOM_BOOKING_REPOSITORY,
} from '@/domain/booking';
import { SearchRoomBookingsDto } from '../dtos/search-room-bookings.dto';
import { TokenPayload } from '@/domain/auth';
import { paginate, PaginationResponse } from '@/shared';
import { RoomBookingResponseDto } from '../dtos/room-booking-response.dto';
import { UserRole } from '@/domain/user';
import { RoomBookingMapper } from '../mappers/room-booking.mapper';

@Injectable()
export class ListRoomBookingsUseCase {
  constructor(
    @Inject(ROOM_BOOKING_REPOSITORY)
    private readonly roomBookingRepository: IRoomBookingRepository,
  ) {}

  async execute(
    dto: SearchRoomBookingsDto,
    currentUser: TokenPayload,
  ): Promise<PaginationResponse<RoomBookingResponseDto>> {
    const isStaffOrAdmin = [UserRole.ADMIN, UserRole.STAFF].includes(
      currentUser.role as UserRole,
    );

    const filter = {
      ...dto,
      skip: dto.skip,
      userId: isStaffOrAdmin ? dto.userId : currentUser.sub,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    };

    const [bookings, total] = await this.roomBookingRepository.findAll(filter);

    return paginate(
      bookings.map((b) => RoomBookingMapper.toResponse(b)),
      total,
      dto.page,
      dto.limit,
    );
  }
}
