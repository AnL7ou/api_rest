export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

export class User {
    private _id: number;
    private _username: string;
    private _password: string;
    private _email: string;
    private _role: UserRole;
    private _createdAt: string;

    constructor(
        id: number,
        username: string,
        password: string,
        email: string,
        role: UserRole = UserRole.USER,
        createdAt: string = new Date().toISOString()
    ) {
        this._id = id;
        this._username = username;
        this._password = password;
        this._email = email;
        this._role = role;
        this._createdAt = createdAt;
    }

    get id(): number { return this._id; }
    set id(id: number) { this._id = id; }

    get username(): string { return this._username; }
    set username(username: string) { this._username = username; }

    get password(): string { return this._password; }
    set password(password: string) { this._password = password; }

    get email(): string { return this._email; }
    set email(email: string) { this._email = email; }

    get role(): UserRole { return this._role; }
    set role(role: UserRole) { this._role = role; }

    get createdAt(): string { return this._createdAt; }
    set createdAt(createdAt: string) { this._createdAt = createdAt; }

    // Méthode pour retourner l'utilisateur sans le mot de passe
    toSafeObject() {
        return {
            id: this._id,
            username: this._username,
            email: this._email,
            role: this._role,
            createdAt: this._createdAt
        };
    }
}