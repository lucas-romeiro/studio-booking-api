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
  CreateRoomDto,
  CreateRoomUseCase,
  DeleteRoomUseCase,
  GetRoomUseCase,
  RoomResponseDto,
  SearchRoomsDto,
  SearchRoomsUseCase,
  UpdateRoomDto,
  UpdateRoomUseCase,
} from '@/application/room';
import { Roles } from '../decorators';
import { UserRole } from '@/domain/user';
import { PaginationResponse } from '@/shared';

@ApiTags('rooms')
@ApiBearerAuth()
@Controller('rooms')
export class RoomController {
  constructor(
    private readonly createRoom: CreateRoomUseCase,
    private readonly getRoom: GetRoomUseCase,
    private readonly searchRooms: SearchRoomsUseCase,
    private readonly updateRoom: UpdateRoomUseCase,
    private readonly deleteRoom: DeleteRoomUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creates a room (admin)' })
  async create(@Body() dto: CreateRoomDto): Promise<RoomResponseDto> {
    return this.createRoom.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Search for available rooms' })
  async search(
    @Query() dto: SearchRoomsDto,
  ): Promise<PaginationResponse<RoomResponseDto>> {
    return this.searchRooms.execute(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search room by id' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RoomResponseDto> {
    return this.getRoom.execute(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update room (admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoomDto,
  ): Promise<RoomResponseDto> {
    return this.updateRoom.execute(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate room (admin)' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteRoom.execute(id);
  }
}
