import type { Member } from "../Entity/Member.js";

export interface MemberRepository {
  findAll(): Promise<Member[]>;
  findById(id: number): Promise<Member | null>;
  insert(member: Member): Promise<boolean>;
  update(member: Member): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
