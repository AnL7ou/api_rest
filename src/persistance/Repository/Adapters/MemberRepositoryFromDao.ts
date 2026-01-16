import type { Member } from "../../Entity/Member.js";
import type { MemberDao } from "../../DAO/MemberDao.js";
import type { MemberRepository } from "../MemberRepository.js";

export class MemberRepositoryFromDao implements MemberRepository {
  constructor(private dao: MemberDao) {}

  findAll(): Promise<Member[]> {
    return this.dao.findAll();
  }
  findById(id: number): Promise<Member | null> {
    return this.dao.findById(id);
  }
  insert(member: Member): Promise<boolean> {
    return this.dao.insert(member);
  }
  update(member: Member): Promise<boolean> {
    return this.dao.update(member);
  }
  delete(id: number): Promise<boolean> {
    return this.dao.delete(id);
  }
}
