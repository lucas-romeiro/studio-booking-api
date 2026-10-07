import {
  CreateEquipmentDto,
  CreateEquipmentUseCase,
} from '@/application/equipment';
import { InMemoryEquipmentRepository } from '../../__spies__';
import { EquipmentCategory } from '../../../src/domain/equipment';
import { DomainError } from '../../../src/domain/shared';

describe('CreateEquipmentUseCase', () => {
  let useCase: CreateEquipmentUseCase;
  let repo: InMemoryEquipmentRepository;
  let dto: CreateEquipmentDto;

  beforeEach(() => {
    repo = new InMemoryEquipmentRepository();
    useCase = new CreateEquipmentUseCase(repo);

    dto = {
      name: 'Electric Guitar',
      description: 'Fender Stratocaster',
      category: EquipmentCategory.GUITAR,
      pricePerDay: 150,
      totalStock: 2,
    };
  });

  describe('Creation Flow', () => {
    it('should create an equipment successfully and save it to the repository', async () => {
      const response = await useCase.execute(dto);

      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.name).toBe(dto.name);
      expect(response.description).toBe(dto.description);
      expect(response.totalStock).toBe(dto.totalStock);
      expect(response.availableStock).toBe(dto.totalStock);
    });

    it('should trim whitespace from name when creating via use case', async () => {
      const props = { ...dto, name: '  Synthesizer   ' };

      const response = await useCase.execute(props);

      expect(response.name).toBe('Synthesizer');
      expect(repo.equipment[0].name).toBe('Synthesizer');
    });

    it('should throw a DomainError if domain rules are violated', async () => {
      const props = { ...dto, totalStock: 0 };

      await expect(useCase.execute(props)).rejects.toThrow(DomainError);
      await expect(useCase.execute(props)).rejects.toThrow(
        'Stock should be at least 1',
      );
    });

    it('should throw a DomainError if name is invalid', async () => {
      const props = { ...dto, name: 'G' };

      await expect(useCase.execute(props)).rejects.toThrow(DomainError);
      await expect(useCase.execute(props)).rejects.toThrow(
        'The name must have at least 2 characters',
      );
    });
  });
});
