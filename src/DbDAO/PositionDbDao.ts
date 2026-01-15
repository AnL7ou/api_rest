import type { PositionDao } from '../DAO/PositionDao.js';
import { Position } from "../Classes/Position.js";

export class PositionDbDao implements PositionDao {
    private __db: any;

    constructor(db: any) {
        this.__db = db;
    }

    insert(position: Position): void {
        this.__db.exec(`INSERT INTO Position (codePosition, name)
                        SELECT ${position.codePosition}, '${position.name}'
                        WHERE NOT EXISTS (
                            SELECT 1 FROM Position WHERE codePosition = ${position.codePosition}
                        );`);
    }

    update(position: Position): boolean {
        this.__db.run(`UPDATE Position SET name = '${position.name}' 
                        WHERE codePosition = ${position.codePosition};`);
        return this.__db.changes > 0;
    }

    delete(id: number): boolean {
        this.__db.run(`DELETE FROM Position WHERE codePosition = ${id};`);
        return this.__db.changes > 0;
    }

    findAll(): Array<Position> {
        const result = this.__db.all('SELECT * FROM Position;');
        return result.map((row: any) => new Position(row.codePosition, row.name));
    }

    findById(id: number): Position | null {
        const result = this.__db.all(`SELECT * FROM Position WHERE codePosition = ${id};`);
        if (result && result.length > 0) {
            const row = result[0];
            return new Position(row.codePosition, row.name);
        }
        return null;
    }

    addMemberToPosition(memberId: number, positionId: number): boolean {
        try {
            this.__db.exec(`INSERT INTO Member_Position (memberId, positionId)
                            SELECT ${memberId}, ${positionId}
                            WHERE NOT EXISTS (
                                SELECT 1 FROM Member_Position 
                                WHERE memberId = ${memberId} AND positionId = ${positionId}
                            );`);
            return true;
        } catch (error) {
            return false;
        }
    }

    removeMemberFromPosition(memberId: number, positionId: number): boolean {
        this.__db.run(`DELETE FROM Member_Position 
                        WHERE memberId = ${memberId} AND positionId = ${positionId};`);
        return this.__db.changes > 0;
    }

    findPositionsByMember(memberId: number): Array<Position> {
        const result = this.__db.all(`
            SELECT p.* FROM Position p
            INNER JOIN Member_Position mp ON p.codePosition = mp.positionId
            WHERE mp.memberId = ${memberId};
        `);
        return result.map((row: any) => new Position(row.codePosition, row.name));
    }

    findMembersByPosition(positionId: number): Array<number> {
        const result = this.__db.all(`
            SELECT memberId FROM Member_Position
            WHERE positionId = ${positionId};
        `);
        return result.map((row: any) => row.memberId);
    }
}