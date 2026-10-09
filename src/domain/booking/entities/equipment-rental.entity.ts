import { RentalPeriod } from '../../equipment';
import { Money } from '../../room';
import { BaseEntity, DomainError } from '../../shared';
import { RentalStatus } from '../value-objects/rental-status.vo';

interface CreateEquipmentRentalProps {
  userId: string;
  equipmentId: string;
  quantity: number;
  rentalPeriod: RentalPeriod;
  totalPrice: Money;
}

export class EquipmentRental extends BaseEntity {
  private constructor(
    id: string,
    public readonly userId: string,
    public readonly equipmentId: string,
    public readonly quantity: number,
    public readonly rentalPeriod: RentalPeriod,
    public readonly totalPrice: Money,
    private _status: RentalStatus,
    createdAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, deletedAt);
  }

  static create(props: CreateEquipmentRentalProps): EquipmentRental {
    if (props.quantity < 1) {
      throw new DomainError('The quantity must be at least 1');
    }

    return new EquipmentRental(
      crypto.randomUUID(),
      props.userId,
      props.equipmentId,
      props.quantity,
      props.rentalPeriod,
      props.totalPrice,
      RentalStatus.PENDING,
      new Date(),
      null,
    );
  }

  static restore(props: {
    id: string;
    userId: string;
    equipmentId: string;
    quantity: number;
    rentalPeriod: RentalPeriod;
    totalPrice: Money;
    status: RentalStatus;
    createdAt: Date;
    deletedAt: Date | null;
  }): EquipmentRental {
    return new EquipmentRental(
      props.id,
      props.userId,
      props.equipmentId,
      props.quantity,
      props.rentalPeriod,
      props.totalPrice,
      props.status,
      props.createdAt,
      props.deletedAt,
    );
  }

  confirm(): void {
    if (this._status !== RentalStatus.PENDING) {
      throw new DomainError('Only pending rentals can be confirmed');
    }

    this._status = RentalStatus.CONFIRMED;
  }

  cancel(): void {
    if (this._status === RentalStatus.CANCELLED) {
      throw new DomainError('The rental has already been cancelled');
    }

    if (this._status === RentalStatus.RETURNED) {
      throw new DomainError(
        'A rental that has already been returned cannot be cancelled',
      );
    }

    this._status = RentalStatus.CANCELLED;
  }

  markAsReturned(): void {
    if (this._status !== RentalStatus.CONFIRMED) {
      throw new DomainError('Only confirmed rentals can be marked as returned');
    }

    this._status = RentalStatus.RETURNED;
  }

  get status(): RentalStatus {
    return this._status;
  }

  get isPending(): boolean {
    return this._status === RentalStatus.PENDING;
  }

  get isConfirmed(): boolean {
    return this._status === RentalStatus.CONFIRMED;
  }

  get isCancelled(): boolean {
    return this._status === RentalStatus.CANCELLED;
  }
}
