import { User } from "../Classes/User.js";

export interface UserDao {
    insert(user: User): void;
    
    update(user: User): void;
    
    delete(id: number): void;
    
    findAll(): Array<User>;
    
    findById(id: number): User | null;
    
    findByUsername(username: string): User | null;
    
    findByEmail(email: string): User | null;
}