import {Member} from "../Classes/Member.js"

export interface MemberDao {
    insert(member : Member) : void

    update(member : Member) : void

    delete(id : number) : void

    findAll() : Array<Member>

    findById(id : number) : Array<Member>
}