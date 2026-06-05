import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule, TypedConfigService } from '../config';
import { UserOrmEntity } from './typeorm/entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [TypedConfigService],
      useFactory: async (configService: TypedConfigService) => ({
        ...(await configService.get('database')),
        entities: [UserOrmEntity],
      }),
    }),
  ],
})
export class DatabaseModule {}
