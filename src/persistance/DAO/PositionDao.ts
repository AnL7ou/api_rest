import { Position } from "../Entity/Position.js";

export interface PositionDao {
    insert(position: Position): void;
    
    update(position: Position): boolean;
    
    delete(id: number): boolean;
    
    findAll(): Array<Position>;
    
    findById(id: number): Position | null;
    
    addMemberToPosition(memberId: number, positionId: number): boolean;
    
    removeMemberFromPosition(memberId: number, positionId: number): boolean;
    
    findPositionsByMember(memberId: number): Array<Position>;
    
    findMembersByPosition(positionId: number): Array<number>; // Returns member IDs
}