import { Provider } from '@nestjs/common';
import { REFRESH_TOKEN_REPOSITORY } from '@/domain/auth';
import { RefreshTokenTypeOrmRepository } from '../refresh-token.typeorm-repository';

export const refreshTokenRepositoryProvider: Provider = {
  provide: REFRESH_TOKEN_REPOSITORY,
  useClass: RefreshTokenTypeOrmRepository,
};
