import {
  IUserRepository,
  USER_REPOSITORY,
  UserNotFoundError,
} from '@/domain/user';
import { Inject, Injectable } from '@nestjs/common';
import { UserResponseDto } from '../../user';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email.toString(),
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
