import { EquipmentRental, RentalStatus } from '@/domain/booking';
import { RentalPeriod } from '@/domain/equipment';
import { Money } from '@/domain/room';
import { DomainError } from '@/domain/shared';

describe('EquipmentRental', () => {
  const createValidProps = () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 2);

    return {
      userId: 'user-id',
      equipmentId: 'equipment-id',
      quantity: 1,
      rentalPeriod: new RentalPeriod(startDate, endDate),
      totalPrice: new Money(100),
    };
  };

  describe('Creation Flow', () => {
    it('should create a valid EquipmentRental successfully with PENDING status', () => {
      const props = createValidProps();

      const result = EquipmentRental.create(props);

      expect(result.userId).toBe(props.userId);
      expect(result.equipmentId).toBe(props.equipmentId);
      expect(result.quantity).toBe(props.quantity);
      expect(result.rentalPeriod).toEqual(props.rentalPeriod);
      expect(result.totalPrice.amount).toBe(props.totalPrice.amount);
      expect(result.status).toBe(RentalStatus.PENDING);
      expect(result.isPending).toBe(true); // <-- Adicionado teste para o getter isPending
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.deletedAt).toBeNull();
    });

    it('should throw a DomainError when trying to create a rental with quantity less than 1', () => {
      const props = { ...createValidProps(), quantity: 0 };

      expect(() => EquipmentRental.create(props)).toThrow(DomainError);
      expect(() => EquipmentRental.create(props)).toThrow(
        'The quantity must be at least 1',
      );
    });
  });

  describe('Restoration Flow', () => {
    it('should correctly reconstitute an EquipmentRental instance with pre-existing database data', () => {
      const equipmentRentalProps = {
        ...createValidProps(),
        id: 'existing-uuid',
        status: RentalStatus.CONFIRMED,
        createdAt: new Date(),
        deletedAt: null,
      };

      const result = EquipmentRental.restore(equipmentRentalProps);

      expect(result.id).toBe(equipmentRentalProps.id);
      expect(result.userId).toBe(equipmentRentalProps.userId);
      expect(result.equipmentId).toBe(equipmentRentalProps.equipmentId);
      expect(result.rentalPeriod).toEqual(equipmentRentalProps.rentalPeriod);
      expect(result.totalPrice.amount).toBe(
        equipmentRentalProps.totalPrice.amount,
      );
      expect(result.status).toBe(equipmentRentalProps.status);
      expect(result.createdAt).toEqual(equipmentRentalProps.createdAt);
      expect(result.deletedAt).toBeNull();
    });
  });

  describe('Business Rules', () => {
    it('should successfully confirm a pending rental', () => {
      const equipmentRental = EquipmentRental.create(createValidProps());
      equipmentRental.confirm();

      expect(equipmentRental.status).toBe(RentalStatus.CONFIRMED);
      expect(equipmentRental.isConfirmed).toBe(true);
    });

    it('should throw a DomainError when trying to confirm a rental that is not pending', () => {
      const equipmentRental = EquipmentRental.create(createValidProps());
      equipmentRental.confirm();

      expect(() => equipmentRental.confirm()).toThrow(DomainError);
      expect(() => equipmentRental.confirm()).toThrow(
        'Only pending rentals can be confirmed',
      );
    });

    it('should successfully mark as returned a confirmed rental', () => {
      const equipmentRental = EquipmentRental.create(createValidProps());
      equipmentRental.confirm();

      equipmentRental.markAsReturned();

      expect(equipmentRental.status).toBe(RentalStatus.RETURNED);
    });

    it('should throw a DomainError when trying to mark as returned a rental that is not confirmed', () => {
      const equipmentRental = EquipmentRental.create(createValidProps());

      expect(() => equipmentRental.markAsReturned()).toThrow(DomainError);
      expect(() => equipmentRental.markAsReturned()).toThrow(
        'Only confirmed rentals can be marked as returned',
      );
    });

    it('should successfully cancel a pending rental', () => {
      const equipmentRental = EquipmentRental.create(createValidProps());

      equipmentRental.cancel();

      expect(equipmentRental.status).toBe(RentalStatus.CANCELLED);
      expect(equipmentRental.isCancelled).toBe(true);
    });

    it('should successfully cancel a confirmed rental', () => {
      const equipmentRental = EquipmentRental.create(createValidProps());
      equipmentRental.confirm();

      equipmentRental.cancel();

      expect(equipmentRental.status).toBe(RentalStatus.CANCELLED);
    });

    it('should throw a DomainError when trying to cancel an already cancelled rental', () => {
      const equipmentRental = EquipmentRental.create(createValidProps());
      equipmentRental.cancel();

      expect(() => equipmentRental.cancel()).toThrow(DomainError);
      expect(() => equipmentRental.cancel()).toThrow(
        'The rental has already been cancelled',
      );
    });

    it('should throw a DomainError when trying to cancel an already marked as returned rental', () => {
      const equipmentRental = EquipmentRental.create(createValidProps());
      equipmentRental.confirm();
      equipmentRental.markAsReturned();

      expect(() => equipmentRental.cancel()).toThrow(DomainError);
      expect(() => equipmentRental.cancel()).toThrow(
        'A rental that has already been returned cannot be cancelled',
      );
    });
  });
});
