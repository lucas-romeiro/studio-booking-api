import { CreateUserUseCase } from '@/application/user';
import { UserOrmEntity } from '@/infrastructure/database/typeorm/entities';
import { userRepositoryProvider } from '@/infrastructure/database/typeorm/repositories';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../http/controllers/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [CreateUserUseCase, userRepositoryProvider],
  exports: [userRepositoryProvider],
})
export class UserModule {}
