import type { Position } from "../Entity/Position.js";

export interface PositionRepository {
  findAll(): Promise<Position[]>;
  findById(id: number): Promise<Position | null>;
  insert(position: Position): Promise<boolean>;
  update(position: Position): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
