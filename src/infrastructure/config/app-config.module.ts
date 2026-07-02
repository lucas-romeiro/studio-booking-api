import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  appConfig,
  authConfig,
  databaseConfig,
  redisConfig,
} from './definitions';
import { envSchema } from './env.schema';
import { typedConfigProvider } from './typed-config.provider';
import { TypedConfigService } from './typed-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, redisConfig],
      validationSchema: envSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
  ],
  providers: [typedConfigProvider],
  exports: [TypedConfigService],
})
export class AppConfigModule {}
