import { SubUnit } from "../Entity/SubUnit.js";

export interface SubUnitDao {
    insert(subUnit: SubUnit): void;
    
    update(subUnit: SubUnit): boolean;
    
    delete(id: number): boolean;
    
    findAll(): Array<SubUnit>;
    
    findById(id: number): SubUnit | null;
    
    addMemberToSubUnit(memberId: number, subUnitId: number): boolean;
    
    removeMemberFromSubUnit(memberId: number, subUnitId: number): boolean;
    
    findSubUnitsByMember(memberId: number): Array<SubUnit>;
    
    findMembersBySubUnit(subUnitId: number): Array<number>; // Returns member IDs
}