import type { Request, Response } from "express";
import type { MemberDao } from "../../persistance/DAO/MemberDao.js";
import { Member } from "../../persistance/Entity/Member.js";

export class MemberController {
  constructor(private memberDao: MemberDao) {}

  public findAll = async (_req: Request, res: Response) => {
    try {
      const members = await this.memberDao.findAll();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Unable to retrieve members" });
    }
  };

  public findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid member ID" });

      const member = await this.memberDao.findById(id);
      if (!member) return res.status(404).json({ message: "Member not found" });
      res.json(member);
    } catch {
      res.status(500).json({ error: "Unable to retrieve member" });
    }
  };

  public insert = async (req: Request, res: Response) => {
    try {
      const { id, stageName, firstName, lastName, birthday, skzoo } = req.body;

      // If you allow client-specified IDs, use it. Otherwise generate externally.
      const codeMember = id ?? undefined;
      if (codeMember === undefined) {
        // Minimal strategy: MAX+1
        const all = await this.memberDao.findAll();
        const newId = all.length ? Math.max(...all.map((m) => m.codeMember)) + 1 : 1;
        const member = new Member(newId, stageName, firstName, lastName, birthday, skzoo);
        const ok = await this.memberDao.insert(member);
        if (!ok) return res.status(500).json({ error: "Failed to create member" });
        return res.status(201).json({ message: "Member created successfully", member });
      }

      const member = new Member(codeMember, stageName, firstName, lastName, birthday, skzoo);
      const ok = await this.memberDao.insert(member);
      if (!ok) return res.status(500).json({ error: "Failed to create member" });

      res.status(201).json({ message: "Member created successfully", member });
    } catch (error) {
      res.status(500).json({ error: "Unable to create member" });
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid member ID" });

      const existing = await this.memberDao.findById(id);
      if (!existing) return res.status(404).json({ message: "Member not found" });

      const { stageName, firstName, lastName, birthday, skzoo } = req.body;
      const updated = new Member(id, stageName, firstName, lastName, birthday, skzoo);

      const ok = await this.memberDao.update(updated);
      if (!ok) return res.status(500).json({ error: "Failed to update member" });

      res.json({ message: "Member updated successfully", member: updated });
    } catch {
      res.status(500).json({ error: "Unable to update member" });
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid member ID" });

      const ok = await this.memberDao.delete(id);
      if (!ok) return res.status(404).json({ message: "Member not found" });
      res.json({ message: "Member deleted successfully" });
    } catch {
      res.status(500).json({ error: "Unable to delete member" });
    }
  };
}
