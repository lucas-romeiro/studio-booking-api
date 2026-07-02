import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule, TypedConfigService } from '../config';
import { RefreshTokenOrmEntity, UserOrmEntity } from './typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [TypedConfigService],
      useFactory: async (configService: TypedConfigService) => ({
        ...(await configService.get('database')),
        entities: [UserOrmEntity, RefreshTokenOrmEntity],
      }),
    }),
  ],
})
export class DatabaseModule {}
