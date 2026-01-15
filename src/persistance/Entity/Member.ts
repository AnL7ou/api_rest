export class Member {
    private _codeMember: number;
    private _stageName: string;
    private _firstName: string;
    private _lastName: string;
    private _birthday: string;
    private _skzoo: string;

    constructor(_codeMember: number, _stageName: string, _firstName: string, 
                _lastName: string, _birthday: string, _skzoo: string){
        this._codeMember = _codeMember;
        this._stageName = _stageName;
        this._firstName = _firstName;
        this._lastName = _lastName;
        this._birthday = _birthday;
        this._skzoo = _skzoo;
    }

    get codeMember() : number { return this._codeMember }
    set codeMember(_codeMember : number) { this._codeMember = _codeMember}

    get stageName() : string { return this._stageName }
    set stageName(_stageName : string) { this._stageName = _stageName}

    get firstName() : string { return this._firstName }
    set firstName(_firstName : string) { this._firstName = _firstName}

    get lastName() : string { return this._lastName }
    set lastName(_lastName : string) { this._lastName = _lastName}

    get birthday() : string { return this._birthday }
    set birthday(_birthday : string) { this._birthday = _birthday}

    get skzoo() : string { return this._skzoo }
    set skzoo(_skzoo : string) { this._skzoo = _skzoo}
}