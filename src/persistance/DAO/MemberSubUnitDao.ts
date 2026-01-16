import type { SubUnit } from "../Entity/SubUnit.js";

export interface MemberSubUnitDao {
  add(memberId: number, subUnitId: number): Promise<boolean>;
  remove(memberId: number, subUnitId: number): Promise<boolean>;
  findSubUnitsByMember(memberId: number): Promise<SubUnit[]>;
  findMembersBySubUnit(subUnitId: number): Promise<number[]>;
}
