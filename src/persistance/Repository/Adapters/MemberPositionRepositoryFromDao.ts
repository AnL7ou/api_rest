// src/persistance/Repository/Adapters/MemberPositionRepositoryFromDao.ts
import type { Position } from "../../Entity/Position.js";
import type { MemberPositionDao } from "../../DAO/MemberPositionDao.js";
import type { MemberPositionRepository } from "../MemberPositionRepository.js";

export class MemberPositionRepositoryFromDao implements MemberPositionRepository {
  constructor(private dao: MemberPositionDao) {}

  add(memberId: number, positionId: number): Promise<boolean> {
    return this.dao.add(memberId, positionId);
  }
  remove(memberId: number, positionId: number): Promise<boolean> {
    return this.dao.remove(memberId, positionId);
  }
  findPositionsByMember(memberId: number): Promise<Position[]> {
    return this.dao.findPositionsByMember(memberId);
  }
  findMembersByPosition(positionId: number): Promise<number[]> {
    return this.dao.findMembersByPosition(positionId);
  }
}
