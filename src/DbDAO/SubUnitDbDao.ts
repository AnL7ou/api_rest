import type { SubUnitDao } from '../DAO/SubUnitDao.js';
import { SubUnit } from "../Classes/SubUnit.js";

export class SubUnitDbDao implements SubUnitDao {
    private __db: any;

    constructor(db: any) {
        this.__db = db;
    }

    insert(subUnit: SubUnit): void {
        this.__db.exec(`INSERT INTO SubUnit (codeSubUnit, name)
                        SELECT ${subUnit.codeSubUnit}, '${subUnit.name}'
                        WHERE NOT EXISTS (
                            SELECT 1 FROM SubUnit WHERE codeSubUnit = ${subUnit.codeSubUnit}
                        );`);
    }

    update(subUnit: SubUnit): boolean {
        this.__db.run(`UPDATE SubUnit SET name = '${subUnit.name}' 
                        WHERE codeSubUnit = ${subUnit.codeSubUnit};`);
        return this.__db.changes > 0;
    }

    delete(id: number): boolean {
        this.__db.run(`DELETE FROM SubUnit WHERE codeSubUnit = ${id};`);
        return this.__db.changes > 0;
    }

    findAll(): Array<SubUnit> {
        const result = this.__db.all('SELECT * FROM SubUnit;');
        return result.map((row: any) => new SubUnit(row.codeSubUnit, row.name));
    }

    findById(id: number): SubUnit | null {
        const result = this.__db.all(`SELECT * FROM SubUnit WHERE codeSubUnit = ${id};`);
        if (result && result.length > 0) {
            const row = result[0];
            return new SubUnit(row.codeSubUnit, row.name);
        }
        return null;
    }

    addMemberToSubUnit(memberId: number, subUnitId: number): boolean {
        try {
            this.__db.exec(`INSERT INTO Member_SubUnit (memberId, subUnitId)
                            SELECT ${memberId}, ${subUnitId}
                            WHERE NOT EXISTS (
                                SELECT 1 FROM Member_SubUnit 
                                WHERE memberId = ${memberId} AND subUnitId = ${subUnitId}
                            );`);
            return true;
        } catch (error) {
            return false;
        }
    }

    removeMemberFromSubUnit(memberId: number, subUnitId: number): boolean {
        this.__db.run(`DELETE FROM Member_SubUnit 
                        WHERE memberId = ${memberId} AND subUnitId = ${subUnitId};`);
        return this.__db.changes > 0;
    }

    findSubUnitsByMember(memberId: number): Array<SubUnit> {
        const result = this.__db.all(`
            SELECT s.* FROM SubUnit s
            INNER JOIN Member_SubUnit ms ON s.codeSubUnit = ms.subUnitId
            WHERE ms.memberId = ${memberId};
        `);
        return result.map((row: any) => new SubUnit(row.codeSubUnit, row.name));
    }

    findMembersBySubUnit(subUnitId: number): Array<number> {
        const result = this.__db.all(`
            SELECT memberId FROM Member_SubUnit
            WHERE subUnitId = ${subUnitId};
        `);
        return result.map((row: any) => row.memberId);
    }
}