import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CancelRoomBookingUseCase,
  ConfirmeRoomBookingUseCase,
  CreateRoomBookingDto,
  CreateRoomBookingUseCase,
  ListRoomBookingsUseCase,
  RoomBookingResponseDto,
  SearchRoomBookingsDto,
} from '@/application/booking';
import { CurrentUser, Roles } from '../decorators';
import { TokenPayload } from '@/domain/auth';
import { UserRole } from '@/domain/user';
import { PaginationResponse } from '@/shared';

@ApiTags('room-bookings')
@ApiBearerAuth()
@Controller('room-bookings')
export class RoomBookingsController {
  constructor(
    private readonly createRoomBooking: CreateRoomBookingUseCase,
    private readonly cancelRoomBooking: CancelRoomBookingUseCase,
    private readonly confirmRoomBooking: ConfirmeRoomBookingUseCase,
    private readonly listRoomBookings: ListRoomBookingsUseCase,
  ) {}

  @Post()
  @Roles(UserRole.MUSICIAN, UserRole.STAFF)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a room reservation ' })
  async create(
    @Body() dto: CreateRoomBookingDto,
    @CurrentUser() currentUser: TokenPayload,
  ): Promise<RoomBookingResponseDto> {
    return this.createRoomBooking.execute(dto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Lists all reservations' })
  async list(
    @Query() dto: SearchRoomBookingsDto,
    @CurrentUser() currentUser: TokenPayload,
  ): Promise<PaginationResponse<RoomBookingResponseDto>> {
    return this.listRoomBookings.execute(dto, currentUser);
  }

  @Patch(':id/confirm')
  @Roles(UserRole.STAFF)
  @ApiOperation({ summary: 'Confirms reservation (staff/admin)' })
  async confirm(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RoomBookingResponseDto> {
    return this.confirmRoomBooking.execute(id);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel revervation' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: TokenPayload,
  ): Promise<void> {
    return this.cancelRoomBooking.execute(id, currentUser);
  }
}
