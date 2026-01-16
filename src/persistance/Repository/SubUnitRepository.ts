import type { SubUnit } from "../Entity/SubUnit.js";

export interface SubUnitRepository {
  findAll(): Promise<SubUnit[]>;
  findById(id: number): Promise<SubUnit | null>;
  insert(subUnit: SubUnit): Promise<boolean>;
  update(subUnit: SubUnit): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
