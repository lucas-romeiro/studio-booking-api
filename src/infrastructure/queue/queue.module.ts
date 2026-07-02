import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppConfigModule, TypedConfigService } from '../config';
import { RedisConfig } from '../config/definitions';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [TypedConfigService],
      useFactory: (configService: TypedConfigService) => {
        const redis = configService.get<RedisConfig>('redis');
        return {
          connection: {
            host: redis.host,
            port: redis.port,
          },
        };
      },
    }),
  ],
})
export class QueueModule {}
