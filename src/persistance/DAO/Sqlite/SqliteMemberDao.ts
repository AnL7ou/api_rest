import type { SqliteDb } from "../../../dbInit.js";
import type { MemberDao } from "../MemberDao.js";
import { Member } from "../../Entity/Member.js";

export class SqliteMemberDao implements MemberDao {
  constructor(private db: SqliteDb) {}

  async insert(member: Member): Promise<boolean> {
    const r = await this.db.run(
      `INSERT OR IGNORE INTO Member (codeMember, stageName, firstName, lastName, birthday, skzoo)
       VALUES (?, ?, ?, ?, ?, ?);`,
      member.codeMember,
      member.stageName,
      member.firstName,
      member.lastName,
      member.birthday,
      member.skzoo
    );
    return (r.changes ?? 0) > 0;
  }

  async update(member: Member): Promise<boolean> {
    const r = await this.db.run(
      `UPDATE Member
       SET stageName = ?, firstName = ?, lastName = ?, birthday = ?, skzoo = ?
       WHERE codeMember = ?;`,
      member.stageName,
      member.firstName,
      member.lastName,
      member.birthday,
      member.skzoo,
      member.codeMember
    );
    return (r.changes ?? 0) > 0;
  }

  async delete(id: number): Promise<boolean> {
    const r = await this.db.run(`DELETE FROM Member WHERE codeMember = ?;`, id);
    return (r.changes ?? 0) > 0;
  }

  async findAll(): Promise<Member[]> {
    const rows = await this.db.all<any[]>(`SELECT * FROM Member;`);
    return rows.map(
      (r) => new Member(r.codeMember, r.stageName, r.firstName, r.lastName, r.birthday, r.skzoo)
    );
  }

  async findById(id: number): Promise<Member | null> {
    const r = await this.db.get<any>(`SELECT * FROM Member WHERE codeMember = ?;`, id);
    if (!r) return null;
    return new Member(r.codeMember, r.stageName, r.firstName, r.lastName, r.birthday, r.skzoo);
  }
}
