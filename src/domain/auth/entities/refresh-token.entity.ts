import { BaseEntity, DomainError } from '../../shared';

interface CreateRefreshTokenProps {
  userId: string;
  token: string;
  expiresAt: Date;
}

export class RefreshToken extends BaseEntity {
  private constructor(
    id: string,
    public readonly userId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    createdAt: Date,
    deletedAt: Date | null,
  ) {
    super(id, createdAt, deletedAt);
  }

  static create(props: CreateRefreshTokenProps): RefreshToken {
    return new RefreshToken(
      crypto.randomUUID(),
      props.userId,
      props.token,
      props.expiresAt,
      new Date(),
      null,
    );
  }

  static restore(props: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    deletedAt: Date | null;
  }): RefreshToken {
    return new RefreshToken(
      props.id,
      props.userId,
      props.token,
      props.expiresAt,
      props.createdAt,
      props.deletedAt,
    );
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  revoke(): void {
    if (!this.isActive) {
      throw new DomainError('Refresh token already revoked');
    }
    this.deactivate();
  }
}
