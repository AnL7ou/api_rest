import type { User } from "../../Entity/User.js";
import type { UserDao } from "../../DAO/UserDao.js";
import type { UserRepository } from "../UserRepository.js";

export class UserRepositoryFromDao implements UserRepository {
  constructor(private dao: UserDao) {}

  findAll(): Promise<User[]> {
    return this.dao.findAll();
  }
  findById(id: number): Promise<User | null> {
    return this.dao.findById(id);
  }
  findByUsername(username: string): Promise<User | null> {
    return this.dao.findByUsername(username);
  }
  findByEmail(email: string): Promise<User | null> {
    return this.dao.findByEmail(email);
  }
  insert(user: User): Promise<boolean> {
    return this.dao.insert(user);
  }
  update(user: User): Promise<boolean> {
    return this.dao.update(user);
  }
  delete(id: number): Promise<boolean> {
    return this.dao.delete(id);
  }
}
