import type { SqliteDb } from "../../../dbInit.js";
import type { PositionDao } from "../PositionDao.js";
import { Position } from "../../Entity/Position.js";

export class SqlitePositionDao implements PositionDao {
  constructor(private db: SqliteDb) {}

  async insert(position: Position): Promise<boolean> {
    const r = await this.db.run(
      `INSERT OR IGNORE INTO Position (codePosition, name) VALUES (?, ?);`,
      position.codePosition,
      position.name
    );
    return (r.changes ?? 0) > 0;
  }

  async update(position: Position): Promise<boolean> {
    const r = await this.db.run(
      `UPDATE Position SET name = ? WHERE codePosition = ?;`,
      position.name,
      position.codePosition
    );
    return (r.changes ?? 0) > 0;
  }

  async delete(id: number): Promise<boolean> {
    const r = await this.db.run(`DELETE FROM Position WHERE codePosition = ?;`, id);
    return (r.changes ?? 0) > 0;
  }

  async findAll(): Promise<Position[]> {
    const rows = await this.db.all<any[]>(`SELECT * FROM Position;`);
    return rows.map((r) => new Position(r.codePosition, r.name));
  }

  async findById(id: number): Promise<Position | null> {
    const r = await this.db.get<any>(`SELECT * FROM Position WHERE codePosition = ?;`, id);
    if (!r) return null;
    return new Position(r.codePosition, r.name);
  }
}
