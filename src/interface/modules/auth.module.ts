import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { AppConfigModule, TypedConfigService } from '@/infrastructure/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  RefreshTokenOrmEntity,
  refreshTokenRepositoryProvider,
} from '@/infrastructure/database/typeorm';
import { AuthConfig } from '@/infrastructure/config/definitions';
import { AuthController } from '../http/controllers';
import {
  GetMeUseCase,
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  SignupUseCase,
} from '@/application/auth';
import { JwtTokenAdapter, tokenProvider } from '@/infrastructure/auth/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from '../http/guards';

@Module({
  imports: [
    UserModule,
    AppConfigModule,
    TypeOrmModule.forFeature([RefreshTokenOrmEntity]),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [TypedConfigService],
      useFactory: (configService: TypedConfigService) => {
        const auth = configService.get<AuthConfig>('auth');

        return {
          secret: auth.jwtSecret,
          signOptions: {
            expiresIn: auth.jwtExpiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    SignupUseCase,
    LoginUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    GetMeUseCase,
    JwtTokenAdapter,
    tokenProvider,
    refreshTokenRepositoryProvider,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [tokenProvider],
})
export class AuthModule {}
