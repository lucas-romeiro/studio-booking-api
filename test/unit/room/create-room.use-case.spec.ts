import { CreateRoomDto, CreateRoomUseCase } from '@/application/room';
import { RoomType } from '@/domain/room';
import { InMemoryRoomRepository } from '../../__spies__';

describe('CreateRoomUseCase', () => {
  let useCase: CreateRoomUseCase;
  let repo: InMemoryRoomRepository;
  let dto: CreateRoomDto;

  beforeEach(() => {
    repo = new InMemoryRoomRepository();
    useCase = new CreateRoomUseCase(repo);

    dto = {
      name: 'Room A',
      description: 'A nice for rehearsal and recording',
      type: RoomType.BOTH,
      capacity: 8,
      pricePerHour: 50,
      operatingHours: {
        monday: { open: '08:00', close: '22:00' },
      },
    };
  });

  describe('Create Flow', () => {
    it('creates a room successfully', async () => {
      await useCase.execute(dto);

      expect(repo.rooms).toHaveLength(1);
      expect(repo.rooms[0].name).toBe(dto.name);
      expect(repo.rooms[0].type).toBe(dto.type);
      expect(repo.rooms[0].capacity).toBe(dto.capacity);
      expect(repo.rooms[0].pricePerHour.amount).toBe(dto.pricePerHour);
      expect(repo.rooms[0].operatingHours.toJSON()).toEqual(dto.operatingHours);
    });
  });
});
