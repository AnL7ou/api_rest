import type { SubUnit } from "../../Entity/SubUnit.js";
import type { MemberSubUnitDao } from "../../DAO/MemberSubUnitDao.js";
import type { MemberSubUnitRepository } from "../MemberSubUnitRepository.js";

export class MemberSubUnitRepositoryFromDao implements MemberSubUnitRepository {
  constructor(private dao: MemberSubUnitDao) {}

  add(memberId: number, subUnitId: number): Promise<boolean> {
    return this.dao.add(memberId, subUnitId);
  }
  remove(memberId: number, subUnitId: number): Promise<boolean> {
    return this.dao.remove(memberId, subUnitId);
  }
  findSubUnitsByMember(memberId: number): Promise<SubUnit[]> {
    return this.dao.findSubUnitsByMember(memberId);
  }
  findMembersBySubUnit(subUnitId: number): Promise<number[]> {
    return this.dao.findMembersBySubUnit(subUnitId);
  }
}
