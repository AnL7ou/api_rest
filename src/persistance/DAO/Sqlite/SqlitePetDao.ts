import type { SqliteDb } from "../../../dbInit.js";
import type { PetDao } from "../PetDao.js";
import { Pet } from "../../Entity/Pet.js";

export class SqlitePetDao implements PetDao {
  constructor(private db: SqliteDb) {}

  async insert(pet: Pet): Promise<boolean> {
    const r = await this.db.run(
      `INSERT OR IGNORE INTO Pet (codePet, name, type, birthday, owner)
       VALUES (?, ?, ?, ?, ?);`,
      pet.codePet,
      pet.name,
      pet.type,
      pet.birthday,
      pet.owner
    );
    return (r.changes ?? 0) > 0;
  }

  async update(pet: Pet): Promise<boolean> {
    const r = await this.db.run(
      `UPDATE Pet
       SET name = ?, type = ?, birthday = ?, owner = ?
       WHERE codePet = ?;`,
      pet.name,
      pet.type,
      pet.birthday,
      pet.owner,
      pet.codePet
    );
    return (r.changes ?? 0) > 0;
  }

  async delete(id: number): Promise<boolean> {
    const r = await this.db.run(`DELETE FROM Pet WHERE codePet = ?;`, id);
    return (r.changes ?? 0) > 0;
  }

  async findAll(): Promise<Pet[]> {
    const rows = await this.db.all<any[]>(`SELECT * FROM Pet;`);
    return rows.map((r) => new Pet(r.codePet, r.name, r.type, r.birthday, r.owner));
  }

  async findById(id: number): Promise<Pet | null> {
    const r = await this.db.get<any>(`SELECT * FROM Pet WHERE codePet = ?;`, id);
    if (!r) return null;
    return new Pet(r.codePet, r.name, r.type, r.birthday, r.owner);
  }

  async findByMember(memberId: number): Promise<Pet[]> {
    const rows = await this.db.all<any[]>(`SELECT * FROM Pet WHERE owner = ?;`, memberId);
    return rows.map((r) => new Pet(r.codePet, r.name, r.type, r.birthday, r.owner));
  }
}
