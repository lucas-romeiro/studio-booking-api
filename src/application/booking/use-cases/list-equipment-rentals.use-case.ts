import { Inject, Injectable } from '@nestjs/common';
import {
  EQUIPMENT_RENTAL_REPOSITORY,
  IEquipmentRentalRepository,
} from '@/domain/booking';
import { TokenPayload } from '@/domain/auth';
import { paginate, PaginationResponse } from '@/shared';
import { EquipmentRentalResponseDto } from '../dtos/equipment-rental-response.dto';
import { UserRole } from '@/domain/user';
import { SearchEquipmentRentalsDto } from '../dtos/search-equipment-rentals.dto';
import { EquipmentRentalMapper } from '../mappers/equipment-rental.mapper';

@Injectable()
export class ListEquipmentRentalsUseCase {
  constructor(
    @Inject(EQUIPMENT_RENTAL_REPOSITORY)
    private readonly rentalRepository: IEquipmentRentalRepository,
  ) {}

  async execute(
    dto: SearchEquipmentRentalsDto,
    currentUser: TokenPayload,
  ): Promise<PaginationResponse<EquipmentRentalResponseDto>> {
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

    const [rentals, total] = await this.rentalRepository.findAll(filter);

    return paginate(
      rentals.map((r) => EquipmentRentalMapper.toResponse(r)),
      total,
      dto.page,
      dto.limit,
    );
  }
}
