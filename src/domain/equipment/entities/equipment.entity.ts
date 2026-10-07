import { Money } from '../../room';
import { BaseEntity, DomainError } from '../../shared';
import { EquipmentCategory } from '../value-objects/equipment-category.vo';

interface CreateEquipmentProps {
  name: string;
  description?: string;
  category: EquipmentCategory;
  pricePerDay: Money;
  totalStock: number;
}

export class Equipment extends BaseEntity {
  private constructor(
    id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly category: EquipmentCategory,
    private _pricePerDay: Money,
    private _totalStock: number,
    private _availableStock: number,
    createdAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, deletedAt);
  }

  public static create(props: CreateEquipmentProps): Equipment {
    if (!props.name || props.name.trim().length < 2) {
      throw new DomainError('The name must have at least 2 characters');
    }

    if (props.totalStock < 1) {
      throw new DomainError('Stock should be at least 1');
    }

    return new Equipment(
      crypto.randomUUID(),
      props.name.trim(),
      props.description ?? null,
      props.category,
      props.pricePerDay,
      props.totalStock,
      props.totalStock,
      new Date(),
      null,
    );
  }

  public static restore(props: {
    id: string;
    name: string;
    description: string | null;
    category: EquipmentCategory;
    pricePerDay: Money;
    totalStock: number;
    availableStock: number;
    createdAt: Date;
    deletedAt: Date | null;
  }): Equipment {
    return new Equipment(
      props.id,
      props.name,
      props.description,
      props.category,
      props.pricePerDay,
      props.totalStock,
      props.availableStock,
      props.createdAt,
      props.deletedAt,
    );
  }

  reserve(quantity: number): void {
    if (quantity < 1) {
      throw new DomainError('The quantity must be at least 1');
    }

    if (quantity > this._availableStock) {
      throw new DomainError(
        `Insufficient stock — available: ${this._availableStock}`,
      );
    }

    this._availableStock -= quantity;
  }

  release(quantity: number): void {
    if (quantity < 1) {
      throw new DomainError('The quantity must be at least 1');
    }

    this._availableStock = Math.min(
      this._availableStock + quantity,
      this._totalStock,
    );
  }

  updatePrice(price: Money): void {
    this._pricePerDay = price;
  }

  updateStock(totalStock: number): void {
    if (totalStock < 1) {
      throw new DomainError('Stock must be at least 1');
    }

    const reserved = this._totalStock - this._availableStock;

    if (totalStock < reserved) {
      throw new DomainError(
        `It is not possible to reduce stock below the reserved quantity: ${reserved}`,
      );
    }

    this._totalStock = totalStock;
    this._availableStock = totalStock - reserved;
  }

  calculateRentalPrice(days: number): Money {
    return this._pricePerDay.multiply(days);
  }

  get pricePerDay(): Money {
    return this._pricePerDay;
  }

  get totalStock(): number {
    return this._totalStock;
  }

  get availableStock(): number {
    return this._availableStock;
  }

  get isAvailable(): boolean {
    return this._availableStock > 0;
  }
}
