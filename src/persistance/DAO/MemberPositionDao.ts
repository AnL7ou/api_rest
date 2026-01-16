import type { Position } from "../Entity/Position.js";

export interface MemberPositionDao {
  add(memberId: number, positionId: number): Promise<boolean>;
  remove(memberId: number, positionId: number): Promise<boolean>;
  findPositionsByMember(memberId: number): Promise<Position[]>;
  findMembersByPosition(positionId: number): Promise<number[]>;
}
