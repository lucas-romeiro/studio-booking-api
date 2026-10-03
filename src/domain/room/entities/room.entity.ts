import { BaseEntity, DomainError } from '../../shared';
import { Money } from '../value-objects/money.vo';
import { OperatingHours } from '../value-objects/operating-hours.vo';
import { RoomType } from '../value-objects/room-type.vo';

interface CreateRoomProps {
  name: string;
  description?: string;
  type: RoomType;
  capacity: number;
  pricePerHour: Money;
  operatingHours: OperatingHours;
}

export class Room extends BaseEntity {
  private constructor(
    id: string,
    private _name: string,
    private _description: string | null,
    public readonly type: RoomType,
    private _capacity: number,
    private _pricePerHour: Money,
    private _operatingHours: OperatingHours,
    createdAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, deletedAt);
  }

  public static create(props: CreateRoomProps): Room {
    if (!props.name || props.name.trim().length < 2) {
      throw new DomainError(
        'The room name must be at least 2 characters long.',
      );
    }

    if (props.capacity < 1) {
      throw new DomainError('Capacity must be at least 1');
    }

    return new Room(
      crypto.randomUUID(),
      props.name.trim(),
      props.description ?? null,
      props.type,
      props.capacity,
      props.pricePerHour,
      props.operatingHours,
      new Date(),
      null,
    );
  }

  public static restore(props: {
    id: string;
    name: string;
    description: string | null;
    type: RoomType;
    capacity: number;
    pricePerHour: Money;
    operatingHours: OperatingHours;
    createdAt: Date;
    deletedAt: Date | null;
  }): Room {
    return new Room(
      props.id,
      props.name,
      props.description,
      props.type,
      props.capacity,
      props.pricePerHour,
      props.operatingHours,
      props.createdAt,
      props.deletedAt,
    );
  }

  isAvailableFor(type: RoomType): boolean {
    if (this.type === RoomType.BOTH) return true;
    return this.type === type;
  }

  update(props: {
    name?: string;
    description?: string;
    capacity?: number;
    pricePerHour?: Money;
    operatingHours?: OperatingHours;
  }): void {
    if (props.name !== undefined) {
      if (props.name.trim().length < 2) {
        throw new DomainError('Name must have at least 2 characters');
      }

      this._name = props.name.trim();
    }

    if (props.description !== undefined) {
      this._description = props.description;
    }

    if (props.capacity !== undefined) {
      if (props.capacity < 1) {
        throw new DomainError('Capacity must be at least 1');
      }

      this._capacity = props.capacity;
    }

    if (props.pricePerHour !== undefined) {
      this._pricePerHour = props.pricePerHour;
    }

    if (props.operatingHours !== undefined) {
      this._operatingHours = props.operatingHours;
    }
  }

  calculatePrice(hours: number): Money {
    return this._pricePerHour.multiply(hours);
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get capacity(): number {
    return this._capacity;
  }

  get pricePerHour(): Money {
    return this._pricePerHour;
  }

  get operatingHours(): OperatingHours {
    return this._operatingHours;
  }
}
