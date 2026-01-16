import type { Pet } from "../../Entity/Pet.js";
import type { PetDao } from "../../DAO/PetDao.js";
import type { PetRepository } from "../PetRepository.js";

export class PetRepositoryFromDao implements PetRepository {
  constructor(private dao: PetDao) {}

  findAll(): Promise<Pet[]> {
    return this.dao.findAll();
  }
  findById(id: number): Promise<Pet | null> {
    return this.dao.findById(id);
  }
  findByMember(memberId: number): Promise<Pet[]> {
    return this.dao.findByMember(memberId);
  }
  insert(pet: Pet): Promise<boolean> {
    return this.dao.insert(pet);
  }
  update(pet: Pet): Promise<boolean> {
    return this.dao.update(pet);
  }
  delete(id: number): Promise<boolean> {
    return this.dao.delete(id);
  }
}
