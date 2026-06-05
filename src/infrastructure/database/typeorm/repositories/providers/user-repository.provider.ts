import { USER_REPOSITORY } from '@/domain/user';
import { Provider } from '@nestjs/common';
import { UserTypeOrmRepository } from '../user.typeorm-repository';

export const userRepositoryProvider: Provider = {
  provide: USER_REPOSITORY,
  useClass: UserTypeOrmRepository,
};
