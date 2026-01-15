import type { MemberDao } from '../DAO/MemberDao.js';
import { Member } from "../Classes/Member.js";

export class MemberDbDao implements MemberDao {
    private __db : any;

    constructor(db : any){
        this.__db = db;
    }

    insert(member : Member) {
        
        this.__db.exec(`INSERT INTO Member (codeMember, stageName, firstName, lastName, birthday, skzoo)
                        SELECT ${member.codeMember}, 
                            '${member.stageName}', 
                            '${member.firstName}', 
                            '${member.lastName}', 
                            '${member.birthday}', 
                            '${member.skzoo}'
                        WHERE NOT EXISTS (
                            SELECT 1 FROM Member 
                            WHERE (
                                codeMember = ${member.codeMember}
                                AND stageName = '${member.stageName}'
                                AND firstName = '${member.firstName}'
                                AND lastName =  '${member.lastName}'
                                AND birthday = '${member.birthday}'
                                AND skzoo = '${member.skzoo}'
                            )
                            OR (
                                stageName = '${member.stageName}'
                                AND firstName = '${member.firstName}'
                                AND lastName =  '${member.lastName}'
                                AND birthday = '${member.birthday}'
                                AND skzoo = '${member.skzoo}'
                            )
                            );`)

    }

    update(member : Member) {
        this.__db.run(`UPDATE Member SET codeMember = ${member.codeMember}, 
                                        stageName = '${member.stageName}', 
                                        firstName = '${member.firstName}',
                                        lastName =  '${member.lastName}',
                                        birthday = '${member.birthday}',
                                        skzoo = '${member.skzoo}' 
                                        WHERE codeMember = ${member.codeMember};`)
        return this.__db.changes > 0;
    }

    delete(id : number) {
        this.__db.run(`DELETE FROM Member WHERE codeMember = ${id}; `)
        return this.__db.changes > 0;
    }

    findAll() : Array<Member> {
        const result = this.__db.all('SELECT * FROM Member;')
        return result;
    }

    findById(id : number) : Array<Member> {
        const result = this.__db.all(`SELECT * FROM Member
                                    WHERE codeMember = ${id};`)
        return result;
    }
}