import type { User } from "../Entity/User.js";

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  insert(user: User): Promise<boolean>;
  update(user: User): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
