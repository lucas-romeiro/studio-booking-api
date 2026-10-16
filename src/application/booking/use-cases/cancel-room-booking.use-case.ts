import { Inject, Injectable } from '@nestjs/common';
import {
  IRoomBookingRepository,
  ROOM_BOOKING_REPOSITORY,
  RoomBookingNotFoundError,
  UnauthorizedBookingError,
} from '@/domain/booking';
import { TokenPayload } from '@/domain/auth';
import { UserRole } from '@/domain/user';

@Injectable()
export class CancelRoomBookingUseCase {
  constructor(
    @Inject(ROOM_BOOKING_REPOSITORY)
    private readonly roomBookingRepository: IRoomBookingRepository,
  ) {}

  async execute(id: string, currentUser: TokenPayload): Promise<void> {
    const booking = await this.roomBookingRepository.findById(id);

    if (!booking) {
      throw new RoomBookingNotFoundError(id);
    }

    const isOwner = booking.userId === currentUser.sub;
    const isStaffOrAdmin = [UserRole.ADMIN, UserRole.STAFF].includes(
      currentUser.role as UserRole,
    );

    if (!isOwner && !isStaffOrAdmin) {
      throw new UnauthorizedBookingError();
    }

    booking.cancel();

    await this.roomBookingRepository.save(booking);
  }
}
