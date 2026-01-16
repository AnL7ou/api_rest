import type { SqliteDb } from "../../../dbInit.js";
import type { MemberPositionDao } from "../MemberPositionDao.js";
import { Position } from "../../Entity/Position.js";

export class SqliteMemberPositionDao implements MemberPositionDao {
  constructor(private db: SqliteDb) {}

  async add(memberId: number, positionId: number): Promise<boolean> {
    const r = await this.db.run(
      `INSERT OR IGNORE INTO Member_Position (memberId, positionId) VALUES (?, ?);`,
      memberId,
      positionId
    );
    return (r.changes ?? 0) > 0;
  }

  async remove(memberId: number, positionId: number): Promise<boolean> {
    const r = await this.db.run(
      `DELETE FROM Member_Position WHERE memberId = ? AND positionId = ?;`,
      memberId,
      positionId
    );
    return (r.changes ?? 0) > 0;
  }

  async findPositionsByMember(memberId: number): Promise<Position[]> {
    const rows = await this.db.all<any[]>(
      `SELECT p.* FROM Position p
       INNER JOIN Member_Position mp ON mp.positionId = p.codePosition
       WHERE mp.memberId = ?;`,
      memberId
    );
    return rows.map((r) => new Position(r.codePosition, r.name));
  }

  async findMembersByPosition(positionId: number): Promise<number[]> {
    const rows = await this.db.all<any[]>(
      `SELECT memberId FROM Member_Position WHERE positionId = ?;`,
      positionId
    );
    return rows.map((r) => r.memberId as number);
  }
}
