export class Position{
    private _codePosition : number;
    private _name : string;

    constructor( _codePosition : number, _name : string ){
        this._codePosition = _codePosition;
        this._name = _name;
    }

    get codePosition() : number { return this._codePosition }
    set codePosition(_codePosition : number) { this._codePosition = _codePosition}

    get name() : string { return this._name }
    set name(_name : string) { this._name = _name}
}