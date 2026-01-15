import { Pet } from "../Classes/Pet.js"
import { Member } from "../Classes/Member.js"

export interface PetDao {
    insert(pet : Pet) : void

    update(pet : Pet) : void

    delete(id : number) : void

    findAll() : Array<Pet>

    findById(id : number) : Array<Pet>

    findByMember(memberId : number) : Array<Pet>
}