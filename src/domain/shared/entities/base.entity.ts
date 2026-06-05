export abstract class BaseEntity {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    private _deletedAt: Date | null = null,
  ) {}

  deactivate(): void {
    if (this._deletedAt) {
      throw new Error(`${this.constructor.name} is already deactivated`);
    }
    this._deletedAt = new Date();
  }

  get isActive(): boolean {
    return this._deletedAt === null;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }
}
