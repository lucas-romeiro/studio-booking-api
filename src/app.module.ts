import { Module } from '@nestjs/common';
import { AppConfigModule } from './infrastructure/config';
import { DatabaseModule } from './infrastructure/database';
import { AuthModule, UserModule } from './interface/modules';
import { QueueModule } from './infrastructure/queue';

@Module({
  imports: [
    AppConfigModule,
    UserModule,
    DatabaseModule,
    AuthModule,
    QueueModule,
  ],
})
export class AppModule {}
