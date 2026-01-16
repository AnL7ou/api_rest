import type { Request, Response } from "express";
import type { PositionRepository } from "../../persistance/Repository/PositionRepository.js";
import type { MemberPositionRepository } from "../../persistance/Repository/MemberPositionRepository.js";
import { Position } from "../../persistance/Entity/Position.js";

export class PositionController {
  constructor(
    private positions: PositionRepository,
    private memberPositions: MemberPositionRepository
  ) {}

  findAll = async (_: Request, res: Response) => res.json(await this.positions.findAll());

  findById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid position ID" });
    const p = await this.positions.findById(id);
    if (!p) return res.status(404).json({ error: "Position not found" });
    res.json(p);
  };

  insert = async (req: Request, res: Response) => {
    const { id, name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const all = await this.positions.findAll();
    const newId = id ?? (all.length ? Math.max(...all.map(p => p.codePosition)) + 1 : 1);

    const ok = await this.positions.insert(new Position(newId, name));
    if (!ok) return res.status(500).json({ error: "Failed to create position" });
    res.status(201).json({ message: "Position created successfully" });
  };

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid position ID" });

    const existing = await this.positions.findById(id);
    if (!existing) return res.status(404).json({ error: "Position not found" });

    const { name } = req.body;
    const updated = new Position(id, name ?? existing.name);
    const ok = await this.positions.update(updated);
    if (!ok) return res.status(500).json({ error: "Failed to update position" });

    res.json({ message: "Position updated successfully", position: updated });
  };

  delete = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid position ID" });

    const ok = await this.positions.delete(id);
    if (!ok) return res.status(404).json({ error: "Position not found" });
    res.json({ message: "Position deleted successfully" });
  };

  addMember = async (req: Request, res: Response) => {
    const positionId = Number(req.params.id);
    const memberId = Number(req.params.memberId);
    if (Number.isNaN(positionId) || Number.isNaN(memberId)) {
      return res.status(400).json({ error: "Invalid position or member ID" });
    }
    const ok = await this.memberPositions.add(memberId, positionId);
    if (!ok) return res.status(500).json({ error: "Failed to add member to position" });
    res.json({ message: "Member added to position successfully" });
  };

  removeMember = async (req: Request, res: Response) => {
    const positionId = Number(req.params.id);
    const memberId = Number(req.params.memberId);
    if (Number.isNaN(positionId) || Number.isNaN(memberId)) {
      return res.status(400).json({ error: "Invalid position or member ID" });
    }
    const ok = await this.memberPositions.remove(memberId, positionId);
    if (!ok) return res.status(404).json({ error: "Member not in this position" });
    res.json({ message: "Member removed from position successfully" });
  };

  members = async (req: Request, res: Response) => {
    const positionId = Number(req.params.id);
    if (Number.isNaN(positionId)) return res.status(400).json({ error: "Invalid position ID" });
    res.json({ positionId, memberIds: await this.memberPositions.findMembersByPosition(positionId) });
  };
}
