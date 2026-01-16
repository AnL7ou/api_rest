import type { Position } from "../../Entity/Position.js";
import type { PositionDao } from "../../DAO/PositionDao.js";
import type { PositionRepository } from "../PositionRepository.js";

export class PositionRepositoryFromDao implements PositionRepository {
  constructor(private dao: PositionDao) {}

  findAll(): Promise<Position[]> {
    return this.dao.findAll();
  }
  findById(id: number): Promise<Position | null> {
    return this.dao.findById(id);
  }
  insert(position: Position): Promise<boolean> {
    return this.dao.insert(position);
  }
  update(position: Position): Promise<boolean> {
    return this.dao.update(position);
  }
  delete(id: number): Promise<boolean> {
    return this.dao.delete(id);
  }
}
