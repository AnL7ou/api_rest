import type { Request, Response } from "express";
import type { SubUnitDao } from "../../persistance/DAO/SubUnitDao.js";
import type { MemberSubUnitDao } from "../../persistance/DAO/MemberSubUnitDao.js";
import { SubUnit } from "../../persistance/Entity/SubUnit.js";

export class SubUnitController {
  constructor(private subUnits: SubUnitDao, private memberSubUnits: MemberSubUnitDao) {}

  findAll = async (_: Request, res: Response) => {
    try {
      res.json(await this.subUnits.findAll());
    } catch {
      res.status(500).json({ error: "Unable to retrieve sub-units" });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid sub-unit ID" });
      const subUnit = await this.subUnits.findById(id);
      if (!subUnit) return res.status(404).json({ error: "Sub-unit not found" });
      res.json(subUnit);
    } catch {
      res.status(500).json({ error: "Unable to retrieve sub-unit" });
    }
  };

  insert = async (req: Request, res: Response) => {
    try {
      const { id, name } = req.body;
      if (!name) return res.status(400).json({ error: "Name is required" });

      const all = await this.subUnits.findAll();
      const newId = id ?? (all.length ? Math.max(...all.map((s) => s.codeSubUnit)) + 1 : 1);
      const subUnit = new SubUnit(newId, name);

      const ok = await this.subUnits.insert(subUnit);
      if (!ok) return res.status(500).json({ error: "Failed to create sub-unit" });
      res.status(201).json({ message: "Sub-unit created successfully", subUnit });
    } catch {
      res.status(500).json({ error: "Unable to create sub-unit" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid sub-unit ID" });
      const existing = await this.subUnits.findById(id);
      if (!existing) return res.status(404).json({ error: "Sub-unit not found" });

      const { name } = req.body;
      const updated = new SubUnit(id, name ?? existing.name);

      const ok = await this.subUnits.update(updated);
      if (!ok) return res.status(500).json({ error: "Failed to update sub-unit" });
      res.json({ message: "Sub-unit updated successfully", subUnit: updated });
    } catch {
      res.status(500).json({ error: "Unable to update sub-unit" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid sub-unit ID" });
      const ok = await this.subUnits.delete(id);
      if (!ok) return res.status(404).json({ error: "Sub-unit not found" });
      res.json({ message: "Sub-unit deleted successfully" });
    } catch {
      res.status(500).json({ error: "Unable to delete sub-unit" });
    }
  };

  addMember = async (req: Request, res: Response) => {
    try {
      const subUnitId = Number(req.params.id);
      const memberId = Number(req.params.memberId);
      if (Number.isNaN(subUnitId) || Number.isNaN(memberId)) {
        return res.status(400).json({ error: "Invalid sub-unit or member ID" });
      }
      const ok = await this.memberSubUnits.add(memberId, subUnitId);
      if (!ok) return res.status(500).json({ error: "Failed to add member to sub-unit" });
      res.json({ message: "Member added to sub-unit successfully" });
    } catch {
      res.status(500).json({ error: "Unable to add member to sub-unit" });
    }
  };

  removeMember = async (req: Request, res: Response) => {
    try {
      const subUnitId = Number(req.params.id);
      const memberId = Number(req.params.memberId);
      if (Number.isNaN(subUnitId) || Number.isNaN(memberId)) {
        return res.status(400).json({ error: "Invalid sub-unit or member ID" });
      }
      const ok = await this.memberSubUnits.remove(memberId, subUnitId);
      if (!ok) return res.status(404).json({ error: "Member not in this sub-unit" });
      res.json({ message: "Member removed from sub-unit successfully" });
    } catch {
      res.status(500).json({ error: "Unable to remove member from sub-unit" });
    }
  };

  members = async (req: Request, res: Response) => {
    try {
      const subUnitId = Number(req.params.id);
      if (Number.isNaN(subUnitId)) return res.status(400).json({ error: "Invalid sub-unit ID" });
      const memberIds = await this.memberSubUnits.findMembersBySubUnit(subUnitId);
      res.json({ subUnitId, memberIds });
    } catch {
      res.status(500).json({ error: "Unable to retrieve members" });
    }
  };
}
