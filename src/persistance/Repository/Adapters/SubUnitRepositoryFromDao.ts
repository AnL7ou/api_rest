import type { SubUnit } from "../../Entity/SubUnit.js";
import type { SubUnitDao } from "../../DAO/SubUnitDao.js";
import type { SubUnitRepository } from "../SubUnitRepository.js";

export class SubUnitRepositoryFromDao implements SubUnitRepository {
  constructor(private dao: SubUnitDao) {}

  findAll(): Promise<SubUnit[]> {
    return this.dao.findAll();
  }
  findById(id: number): Promise<SubUnit | null> {
    return this.dao.findById(id);
  }
  insert(subUnit: SubUnit): Promise<boolean> {
    return this.dao.insert(subUnit);
  }
  update(subUnit: SubUnit): Promise<boolean> {
    return this.dao.update(subUnit);
  }
  delete(id: number): Promise<boolean> {
    return this.dao.delete(id);
  }
}
