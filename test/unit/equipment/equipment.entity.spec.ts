import { Equipment, EquipmentCategory } from '@/domain/equipment';
import { DomainError } from '@/domain/shared';
import { Money } from '@/domain/room';

describe('Equipment Entity', () => {
  const createValidProps = () => ({
    name: 'Drum',
    description: 'Drum with a complete set of cymbals',
    category: EquipmentCategory.DRUMS,
    pricePerDay: new Money(100),
    totalStock: 5,
  });

  describe('Create', () => {
    it('should create an equipment entity successfully', () => {
      const props = createValidProps();
      const equipment = Equipment.create(props);

      expect(equipment.id).toBeDefined();
      expect(equipment.name).toBe(props.name);
      expect(equipment.description).toBe(props.description);
      expect(equipment.category).toBe(props.category);
      expect(equipment.pricePerDay).toBe(props.pricePerDay);
      expect(equipment.totalStock).toBe(props.totalStock);
      expect(equipment.isAvailable).toBe(true);
      expect(equipment.createdAt).toBeInstanceOf(Date);
      expect(equipment.deletedAt).toBeNull();
    });

    it('should trim whitespace from the equipment name during creation', () => {
      const props = { ...createValidProps(), name: ' Acoustic Drum     ' };
      const equipment = Equipment.create(props);

      expect(equipment.name).toBe('Acoustic Drum');
    });

    it('should throw a DomainError if name is less than 2 characters long', () => {
      const props = { ...createValidProps(), name: 'D' };

      expect(() => Equipment.create(props)).toThrow(DomainError);
      expect(() => Equipment.create(props)).toThrow(
        'The name must have at least 2 characters',
      );
    });

    it('should throw a DomainError if name contains only whitespace', () => {
      const props = { ...createValidProps(), name: '   ' };

      expect(() => Equipment.create(props)).toThrow(DomainError);
      expect(() => Equipment.create(props)).toThrow(
        'The name must have at least 2 characters',
      );
    });

    it('should throw a DomainError if totalStock  is less than 1', () => {
      const props = { ...createValidProps(), totalStock: 0 };

      expect(() => Equipment.create(props)).toThrow(DomainError);
      expect(() => Equipment.create(props)).toThrow(
        'Stock should be at least 1',
      );
    });
  });

  describe('Restore', () => {
    it('should correctly reconstitute an equipment instance with pre-existing database data', () => {
      const eqProps = {
        id: 'existing-uuid',
        name: 'Electric Guitar',
        description: 'Fender Stratocaster',
        category: EquipmentCategory.OTHER,
        pricePerDay: new Money(150),
        totalStock: 3,
        availableStock: 2,
        createdAt: new Date('2026-01-01'),
        deletedAt: null,
      };

      const equipment = Equipment.restore(eqProps);

      expect(equipment.id).toBe(eqProps.id);
      expect(equipment.name).toBe(eqProps.name);
      expect(equipment.description).toBe(eqProps.description);
      expect(equipment.category).toBe(eqProps.category);
      expect(equipment.pricePerDay).toBe(eqProps.pricePerDay);
      expect(equipment.totalStock).toBe(eqProps.totalStock);
      expect(equipment.availableStock).toBe(eqProps.availableStock);
      expect(equipment.createdAt).toEqual(eqProps.createdAt);
      expect(equipment.deletedAt).toBeNull();
    });
  });

  describe('Stock Management (Reserve & Release)', () => {
    it('should successfully reserve equipment stock', () => {
      const equipment = Equipment.create(createValidProps());

      equipment.reserve(2);

      expect(equipment.availableStock).toBe(3);
    });

    it('should throw a DomainError if trying to reserve with quantity less than 1', () => {
      const equipment = Equipment.create(createValidProps());

      expect(() => equipment.reserve(0)).toThrow(DomainError);
      expect(() => equipment.reserve(0)).toThrow(
        'The quantity must be at least 1',
      );
    });

    it('should successfully release previously reserved equipment stock', () => {
      const equipment = Equipment.create(createValidProps());
      equipment.reserve(2);

      equipment.release(1);

      expect(equipment.availableStock).toBe(4);
    });

    it('should not exceed totalStock when releasing stock', () => {
      const equipment = Equipment.create(createValidProps());

      equipment.release(3);

      expect(equipment.availableStock).toBe(5);
    });
  });

  describe('UpdatePrice & CalculateRentalPrice', () => {
    it('should update the price per day successfully', () => {
      const equipment = Equipment.create(createValidProps());
      const newPrice = new Money(200);

      equipment.updatePrice(newPrice);

      expect(equipment.pricePerDay).toBe(newPrice);
    });

    it('should calculate rental price correctly based on days', () => {
      const equipment = Equipment.create({
        ...createValidProps(),
        pricePerDay: new Money(50),
      });

      const total = equipment.calculateRentalPrice(4);

      expect(total.equals(new Money(200))).toBe(true);
    });
  });

  describe('UpdateStock', () => {
    it('should successfully update total stock and adjust available stock accordingly', () => {
      const equipment = Equipment.create(createValidProps());
      equipment.reserve(2);

      equipment.updateStock(8);

      expect(equipment.totalStock).toBe(8);
      expect(equipment.availableStock).toBe(6);
    });

    it('should throw a DomainError if new totalStock is less than 1', () => {
      const equipment = Equipment.create(createValidProps());

      expect(() => equipment.updateStock(0)).toThrow(DomainError);
      expect(() => equipment.updateStock(0)).toThrow(
        'Stock must be at least 1',
      );
    });

    it('should throw a DomainError if trying to reduce stock below the reserved quantity', () => {
      const equipment = Equipment.create(createValidProps());
      equipment.reserve(3);

      expect(() => equipment.updateStock(2)).toThrow(DomainError);
      expect(() => equipment.updateStock(2)).toThrow(
        'It is not possible to reduce stock below the reserved quantity: 3',
      );
    });
  });
});
