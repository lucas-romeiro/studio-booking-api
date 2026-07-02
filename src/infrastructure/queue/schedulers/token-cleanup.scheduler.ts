import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CLEANUP_QUEUE } from '../jobs/cleanup-expired-tokens.job';
import { Queue } from 'bullmq';

@Injectable()
export class TokenCleanupScheduler implements OnModuleInit {
  constructor(@InjectQueue(CLEANUP_QUEUE) private readonly queue: Queue) {}

  async onModuleInit(): Promise<void> {
    await this.queue.add(
      'cleanup-expired-tokens',
      {},
      {
        repeat: { pattern: '0 3 * * *' },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }
}
