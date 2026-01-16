import type { Request, Response } from "express";
import type { PositionDao } from "../../persistance/DAO/PositionDao.js";
import type { MemberPositionDao } from "../../persistance/DAO/MemberPositionDao.js";
import { Position } from "../../persistance/Entity/Position.js";

export class PositionController {
  constructor(private positions: PositionDao, private memberPositions: MemberPositionDao) {}

  findAll = async (_: Request, res: Response) => {
    try {
      res.json(await this.positions.findAll());
    } catch {
      res.status(500).json({ error: "Unable to retrieve positions" });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid position ID" });
      const position = await this.positions.findById(id);
      if (!position) return res.status(404).json({ error: "Position not found" });
      res.json(position);
    } catch {
      res.status(500).json({ error: "Unable to retrieve position" });
    }
  };

  insert = async (req: Request, res: Response) => {
    try {
      const { id, name } = req.body;
      if (!name) return res.status(400).json({ error: "Name is required" });

      const all = await this.positions.findAll();
      const newId = id ?? (all.length ? Math.max(...all.map((p) => p.codePosition)) + 1 : 1);

      const position = new Position(newId, name);
      const ok = await this.positions.insert(position);
      if (!ok) return res.status(500).json({ error: "Failed to create position" });
      res.status(201).json({ message: "Position created successfully", position });
    } catch {
      res.status(500).json({ error: "Unable to create position" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid position ID" });
      const existing = await this.positions.findById(id);
      if (!existing) return res.status(404).json({ error: "Position not found" });

      const { name } = req.body;
      const updated = new Position(id, name ?? existing.name);
      const ok = await this.positions.update(updated);
      if (!ok) return res.status(500).json({ error: "Failed to update position" });
      res.json({ message: "Position updated successfully", position: updated });
    } catch {
      res.status(500).json({ error: "Unable to update position" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid position ID" });
      const ok = await this.positions.delete(id);
      if (!ok) return res.status(404).json({ error: "Position not found" });
      res.json({ message: "Position deleted successfully" });
    } catch {
      res.status(500).json({ error: "Unable to delete position" });
    }
  };

  addMember = async (req: Request, res: Response) => {
    try {
      const positionId = Number(req.params.id);
      const memberId = Number(req.params.memberId);
      if (Number.isNaN(positionId) || Number.isNaN(memberId)) {
        return res.status(400).json({ error: "Invalid position or member ID" });
      }
      const ok = await this.memberPositions.add(memberId, positionId);
      if (!ok) return res.status(500).json({ error: "Failed to add member to position" });
      res.json({ message: "Member added to position successfully" });
    } catch {
      res.status(500).json({ error: "Unable to add member to position" });
    }
  };

  removeMember = async (req: Request, res: Response) => {
    try {
      const positionId = Number(req.params.id);
      const memberId = Number(req.params.memberId);
      if (Number.isNaN(positionId) || Number.isNaN(memberId)) {
        return res.status(400).json({ error: "Invalid position or member ID" });
      }
      const ok = await this.memberPositions.remove(memberId, positionId);
      if (!ok) return res.status(404).json({ error: "Member not in this position" });
      res.json({ message: "Member removed from position successfully" });
    } catch {
      res.status(500).json({ error: "Unable to remove member from position" });
    }
  };

  members = async (req: Request, res: Response) => {
    try {
      const positionId = Number(req.params.id);
      if (Number.isNaN(positionId)) return res.status(400).json({ error: "Invalid position ID" });
      const memberIds = await this.memberPositions.findMembersByPosition(positionId);
      res.json({ positionId, memberIds });
    } catch {
      res.status(500).json({ error: "Unable to retrieve members" });
    }
  };
}
