import {
  Email,
  IUserRepository,
  User,
  USER_REPOSITORY,
  UserAlreadyExistsError,
} from '@/domain/user';
import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    const alreadyExists = await this.userRepository.exists(dto.email);

    if (alreadyExists) {
      throw new UserAlreadyExistsError(dto.email);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = User.create({
      name: dto.name,
      email: new Email(dto.email),
      passwordHash,
      role: dto.role,
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email.toString(),
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
