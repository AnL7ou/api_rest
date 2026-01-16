import type { SqliteDb } from "../../../dbInit.js";
import type { SubUnitDao } from "../SubUnitDao.js";
import { SubUnit } from "../../Entity/SubUnit.js";

export class SqliteSubUnitDao implements SubUnitDao {
  constructor(private db: SqliteDb) {}

  async insert(subUnit: SubUnit): Promise<boolean> {
    const r = await this.db.run(
      `INSERT OR IGNORE INTO SubUnit (codeSubUnit, name) VALUES (?, ?);`,
      subUnit.codeSubUnit,
      subUnit.name
    );
    return (r.changes ?? 0) > 0;
  }

  async update(subUnit: SubUnit): Promise<boolean> {
    const r = await this.db.run(
      `UPDATE SubUnit SET name = ? WHERE codeSubUnit = ?;`,
      subUnit.name,
      subUnit.codeSubUnit
    );
    return (r.changes ?? 0) > 0;
  }

  async delete(id: number): Promise<boolean> {
    const r = await this.db.run(`DELETE FROM SubUnit WHERE codeSubUnit = ?;`, id);
    return (r.changes ?? 0) > 0;
  }

  async findAll(): Promise<SubUnit[]> {
    const rows = await this.db.all<any[]>(`SELECT * FROM SubUnit;`);
    return rows.map((r) => new SubUnit(r.codeSubUnit, r.name));
  }

  async findById(id: number): Promise<SubUnit | null> {
    const r = await this.db.get<any>(`SELECT * FROM SubUnit WHERE codeSubUnit = ?;`, id);
    if (!r) return null;
    return new SubUnit(r.codeSubUnit, r.name);
  }
}
