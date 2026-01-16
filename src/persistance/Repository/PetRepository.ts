import type { Pet } from "../Entity/Pet.js";

export interface PetRepository {
  findAll(): Promise<Pet[]>;
  findById(id: number): Promise<Pet | null>;
  findByMember(ownerId: number): Promise<Pet[]>;
  insert(pet: Pet): Promise<boolean>;
  update(pet: Pet): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
