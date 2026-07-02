import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenOrmEntity } from '../../database/typeorm';
import { IsNull, LessThan, Repository } from 'typeorm';
import { Job } from 'bullmq';

export const CLEANUP_QUEUE = 'cleanup';

@Processor(CLEANUP_QUEUE)
export class CleanupExpiredTokensJob extends WorkerHost {
  constructor(
    @InjectRepository(RefreshTokenOrmEntity)
    private readonly repo: Repository<RefreshTokenOrmEntity>,
  ) {
    super();
  }

  async process(_job: Job): Promise<void> {
    await this.repo.softDelete({
      expiresAt: LessThan(new Date()),
      deletedAt: IsNull(),
    });
  }
}
