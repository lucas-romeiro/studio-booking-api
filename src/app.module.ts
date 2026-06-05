import { Module } from '@nestjs/common';
import { AppConfigModule } from './infrastructure/config';
import { DatabaseModule } from './infrastructure/database';
import { UserModule } from './interface/modules';

@Module({
  imports: [AppConfigModule, UserModule, DatabaseModule],
})
export class AppModule {}
