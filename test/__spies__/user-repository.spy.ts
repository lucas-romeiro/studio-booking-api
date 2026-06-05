import { IUserRepository, User } from '@/domain/user';

export class InMemoryUserRepository implements IUserRepository {
  public users: User[] = [];

  async save(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
    return Promise.resolve();
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id) ?? null;
    return Promise.resolve(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email.toString() === email) ?? null;
    return Promise.resolve(user);
  }

  async exists(email: string): Promise<boolean> {
    const user = this.users.some((u) => u.email.toString() === email);
    return Promise.resolve(user);
  }
}
