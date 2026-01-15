import { Pet } from "../Classes/Pet.js";
import {Member} from "../Classes/Member.js"
import type { PetDao } from "../DAO/PetDao.js";

export class PetDbDao implements PetDao{
    private __db : any;

    constructor(db : any){
        this.__db = db;
    }

    insert(pet : Pet) {
        this.__db.exec(`INSERT INTO pet (codePet, name, type, birthday, owner)
                        SELECT ${pet.codePet}, 
                            '${pet.name}', 
                            '${pet.type}', 
                            '${pet.birthday}', 
                            ${pet.owner}
                        WHERE NOT EXISTS (
                            SELECT 1 FROM pet 
                            WHERE (
                                codePet = ${pet.codePet}
                                AND name = '${pet.name}'
                                AND type = '${pet.type}'
                                AND birthday = '${pet.birthday}'
                                AND owner = ${pet.owner}
                            )
                            OR (
                                name = '${pet.name}'
                                AND type = '${pet.type}'
                                AND birthday = '${pet.birthday}'
                                AND owner = ${pet.owner}
                            )
                        );`)


    }

    update(pet : Pet) {
        this.__db.run(`UPDATE pet SET codePet = ${pet.codePet}, 
                                        name = '${pet.name}', 
                                        type = '${pet.type}',
                                        birthday = '${pet.birthday}',
                                        owner = ${pet.owner} 
                                        WHERE codePet = ${pet.codePet};`)
        return this.__db.changes > 0;
    }

    delete(id : number) {
        this.__db.run(`DELETE FROM pet WHERE codepet = ${id}; `)
        return this.__db.changes > 0;
    }

    findAll() : Array<Pet> {
        const result = this.__db.all('SELECT * FROM Pet;')
        return result;
    }

    findById(id : number) : Array<Pet> {
        const result = this.__db.all(`SELECT * FROM Pet
                                    WHERE codePet = ${id};`)
        return result;
    }

    findByMember(memberId : number) : Array<Pet> {
        const result = this.__db.all(`SELECT * FROM pet
                                    INNER JOIN Member ON Pet.owner=Member.codeMember;
                                    WHERE codeMember = ${memberId};`)
        return result;
    }
}