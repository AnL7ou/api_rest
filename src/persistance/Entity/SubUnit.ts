export class SubUnit{
    private _codeSubUnit : number;
    private _name : string;

    constructor( _codeSubUnit : number, _name : string ){
        this._codeSubUnit = _codeSubUnit;
        this._name = _name;
    }

    get codeSubUnit() : number { return this._codeSubUnit }
    set codeSubUnit(_codeSubUnit : number) { this._codeSubUnit = _codeSubUnit}

    get name() : string { return this._name }
    set name(_name : string) { this._name = _name}
}