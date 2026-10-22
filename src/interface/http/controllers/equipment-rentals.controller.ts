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
  CancelEquipmentRentalUseCase,
  ConfirmEquipmentRentalUseCase,
  CreateEquipmentRentalDto,
  CreateEquipmentRentalUseCase,
  EquipmentRentalResponseDto,
  ListEquipmentRentalsUseCase,
  ReturnEquipmentRentalUseCase,
  SearchEquipmentRentalsDto,
} from '@/application/booking';
import { CurrentUser, Roles } from '../decorators';
import { TokenPayload } from '@/domain/auth';
import { UserRole } from '@/domain/user';
import { PaginationResponse } from '@/shared';

@ApiTags('equipment-rentals')
@ApiBearerAuth()
@Controller('equipment-rentals')
export class EquimentRentalsController {
  constructor(
    private readonly createRental: CreateEquipmentRentalUseCase,
    private readonly cancelRental: CancelEquipmentRentalUseCase,
    private readonly listRentals: ListEquipmentRentalsUseCase,
    private readonly confirmRental: ConfirmEquipmentRentalUseCase,
    private readonly returnRental: ReturnEquipmentRentalUseCase,
  ) {}

  @Post()
  @Roles(UserRole.MUSICIAN, UserRole.RENTER, UserRole.STAFF)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Createequipment rental' })
  async create(
    @Body() dto: CreateEquipmentRentalDto,
    @CurrentUser() currentUser: TokenPayload,
  ): Promise<EquipmentRentalResponseDto> {
    return this.createRental.execute(dto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'List rentals' })
  async list(
    @Query() dto: SearchEquipmentRentalsDto,
    @CurrentUser() currentUser: TokenPayload,
  ): Promise<PaginationResponse<EquipmentRentalResponseDto>> {
    return this.listRentals.execute(dto, currentUser);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel rental' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: TokenPayload,
  ): Promise<void> {
    return this.cancelRental.execute(id, currentUser);
  }

  @Patch(':id/confirm')
  @Roles(UserRole.STAFF)
  @ApiOperation({ summary: 'Confirm rental (staff/admin)' })
  async confirm(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EquipmentRentalResponseDto> {
    return this.confirmRental.execute(id);
  }

  @Patch(':id/return')
  @Roles(UserRole.STAFF)
  @ApiOperation({ summary: 'Record return (staff/admin)' })
  async return(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EquipmentRentalResponseDto> {
    return this.returnRental.execute(id);
  }
}
