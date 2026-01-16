import type { SqliteDb } from "../../../dbInit.js";
import type { UserDao } from "../UserDao.js";
import { User } from "../../Entity/User.js";

export class SqliteUserDao implements UserDao {
  constructor(private db: SqliteDb) {}

  async insert(user: User): Promise<boolean> {
    const r = await this.db.run(
      `INSERT OR IGNORE INTO User (id, username, password, email, role, createdAt)
       VALUES (?, ?, ?, ?, ?, ?);`,
      user.id,
      user.username,
      user.password,
      user.email,
      user.role,
      user.createdAt
    );
    return (r.changes ?? 0) > 0;
  }

  async update(user: User): Promise<boolean> {
    const r = await this.db.run(
      `UPDATE User
       SET username = ?, password = ?, email = ?, role = ?
       WHERE id = ?;`,
      user.username,
      user.password,
      user.email,
      user.role,
      user.id
    );
    return (r.changes ?? 0) > 0;
  }

  async delete(id: number): Promise<boolean> {
    const r = await this.db.run(`DELETE FROM User WHERE id = ?;`, id);
    return (r.changes ?? 0) > 0;
  }

  async findAll(): Promise<User[]> {
    const rows = await this.db.all<any[]>(`SELECT * FROM User;`);
    return rows.map((r) => new User(r.id, r.username, r.password, r.email, r.role, r.createdAt));
  }

  async findById(id: number): Promise<User | null> {
    const r = await this.db.get<any>(`SELECT * FROM User WHERE id = ?;`, id);
    if (!r) return null;
    return new User(r.id, r.username, r.password, r.email, r.role, r.createdAt);
  }

  async findByUsername(username: string): Promise<User | null> {
    const r = await this.db.get<any>(`SELECT * FROM User WHERE username = ?;`, username);
    if (!r) return null;
    return new User(r.id, r.username, r.password, r.email, r.role, r.createdAt);
  }

  async findByEmail(email: string): Promise<User | null> {
    const r = await this.db.get<any>(`SELECT * FROM User WHERE email = ?;`, email);
    if (!r) return null;
    return new User(r.id, r.username, r.password, r.email, r.role, r.createdAt);
  }
}
