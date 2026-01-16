import type { SqliteDb } from "../../../dbInit.js";
import type { MemberSubUnitDao } from "../MemberSubUnitDao.js";
import { SubUnit } from "../../Entity/SubUnit.js";

export class SqliteMemberSubUnitDao implements MemberSubUnitDao {
  constructor(private db: SqliteDb) {}

  async add(memberId: number, subUnitId: number): Promise<boolean> {
    const r = await this.db.run(
      `INSERT OR IGNORE INTO Member_SubUnit (memberId, subUnitId) VALUES (?, ?);`,
      memberId,
      subUnitId
    );
    return (r.changes ?? 0) > 0;
  }

  async remove(memberId: number, subUnitId: number): Promise<boolean> {
    const r = await this.db.run(
      `DELETE FROM Member_SubUnit WHERE memberId = ? AND subUnitId = ?;`,
      memberId,
      subUnitId
    );
    return (r.changes ?? 0) > 0;
  }

  async findSubUnitsByMember(memberId: number): Promise<SubUnit[]> {
    const rows = await this.db.all<any[]>(
      `SELECT s.* FROM SubUnit s
       INNER JOIN Member_SubUnit ms ON ms.subUnitId = s.codeSubUnit
       WHERE ms.memberId = ?;`,
      memberId
    );
    return rows.map((r) => new SubUnit(r.codeSubUnit, r.name));
  }

  async findMembersBySubUnit(subUnitId: number): Promise<number[]> {
    const rows = await this.db.all<any[]>(
      `SELECT memberId FROM Member_SubUnit WHERE subUnitId = ?;`,
      subUnitId
    );
    return rows.map((r) => r.memberId as number);
  }
}
