import {
  Body,
  Controller,
  Delete,
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
  CreateEquipmentDto,
  CreateEquipmentUseCase,
  DeleteEquipmentUseCase,
  EquipmentResponseDto,
  GetEquipmentUseCase,
  ListEquipmentDto,
  ListEquipmentUseCase,
  UpdateEquipmentDto,
  UpdateEquipmentUseCase,
} from '@/application/equipment';
import { Roles } from '../decorators';
import { UserRole } from '@/domain/user';
import { PaginationResponse } from '../../../shared';

@ApiTags('equipment')
@ApiBearerAuth()
@Controller('equipment')
export class EquipmentController {
  constructor(
    private readonly createEquipment: CreateEquipmentUseCase,
    private readonly getEquipment: GetEquipmentUseCase,
    private readonly listEquipment: ListEquipmentUseCase,
    private readonly updateEquipment: UpdateEquipmentUseCase,
    private readonly deleteEquipment: DeleteEquipmentUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register equipment (admin)' })
  async create(@Body() dto: CreateEquipmentDto): Promise<EquipmentResponseDto> {
    return this.createEquipment.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List available equipment' })
  async list(
    @Query() dto: ListEquipmentDto,
  ): Promise<PaginationResponse<EquipmentResponseDto>> {
    return this.listEquipment.execute(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search for equipment by ID' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EquipmentResponseDto> {
    return this.getEquipment.execute(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update equipment (admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEquipmentDto,
  ): Promise<EquipmentResponseDto> {
    return this.updateEquipment.execute(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deactivate equipment (admin)',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteEquipment.execute(id);
  }
}
