import { User } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  exists(email: string): Promise<boolean>;
}
