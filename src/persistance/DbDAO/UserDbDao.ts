import type { UserDao } from '../DAO/UserDao.js';
import { User } from "../Entity/User.js";

export class UserDbDao implements UserDao {
    private __db: any;

    constructor(db: any) {
        this.__db = db;
    }

    insert(user: User): void {
        this.__db.exec(`INSERT INTO User (id, username, password, email, role, createdAt)
                        SELECT ${user.id}, 
                            '${user.username}', 
                            '${user.password}', 
                            '${user.email}', 
                            '${user.role}',
                            '${user.createdAt}'
                        WHERE NOT EXISTS (
                            SELECT 1 FROM User 
                            WHERE username = '${user.username}' OR email = '${user.email}'
                        );`);
    }

    update(user: User): boolean {
        this.__db.run(`UPDATE User SET 
                        username = '${user.username}', 
                        password = '${user.password}',
                        email = '${user.email}',
                        role = '${user.role}'
                        WHERE id = ${user.id};`);
        return this.__db.changes > 0;
    }

    delete(id: number): boolean {
        this.__db.run(`DELETE FROM User WHERE id = ${id};`);
        return this.__db.changes > 0;
    }

    findAll(): Array<User> {
        const result = this.__db.all('SELECT * FROM User;');
        return result.map((row: any) => 
            new User(row.id, row.username, row.password, row.email, row.role, row.createdAt)
        );
    }

    findById(id: number): User | null {
        const result = this.__db.all(`SELECT * FROM User WHERE id = ${id};`);
        if (result && result.length > 0) {
            const row = result[0];
            return new User(row.id, row.username, row.password, row.email, row.role, row.createdAt);
        }
        return null;
    }

    findByUsername(username: string): User | null {
        const result = this.__db.all(`SELECT * FROM User WHERE username = '${username}';`);
        if (result && result.length > 0) {
            const row = result[0];
            return new User(row.id, row.username, row.password, row.email, row.role, row.createdAt);
        }
        return null;
    }

    findByEmail(email: string): User | null {
        const result = this.__db.all(`SELECT * FROM User WHERE email = '${email}';`);
        if (result && result.length > 0) {
            const row = result[0];
            return new User(row.id, row.username, row.password, row.email, row.role, row.createdAt);
        }
        return null;
    }
}