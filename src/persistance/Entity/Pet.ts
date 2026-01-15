export class Pet {
    private _codePet: number;
    private _name: string;
    private _type: string;
    private _birthday: string;
    private _owner: number;

    constructor(_codePet: number, _name: string, _type: string, _birthday: string, _owner: number){
        this._codePet = _codePet;
        this._name = _name;
        this._type = _type;
        this._birthday = _birthday;
        this._owner = _owner;
    }

    get codePet() : number { return this._codePet }
    set codePet(_codePet : number) { this._codePet = _codePet}

    get name() : string { return this._name }
    set name(_name : string) { this._name = _name}

    get type() : string { return this._type }
    set type(_type : string) { this._type = _type }

    get birthday() : string { return this._birthday }
    set birthday(_birthday : string) { this._birthday = _birthday}

    get owner() : number { return this._owner }
    set owner(_owner : number) { this._owner = _owner}
}