import type { Request, Response } from "express";
import type { PetDao } from "../../persistance/DAO/PetDao.js";
import { Pet } from "../../persistance/Entity/Pet.js";

export class PetController {
  constructor(private petDao: PetDao) {}

  public findAll = async (_req: Request, res: Response) => {
    try {
      const pets = await this.petDao.findAll();
      res.json(pets);
    } catch {
      res.status(500).json({ error: "Unable to retrieve pets" });
    }
  };

  public findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid pet ID" });
      const pet = await this.petDao.findById(id);
      if (!pet) return res.status(404).json({ message: "Pet not found" });
      res.json(pet);
    } catch {
      res.status(500).json({ error: "Unable to retrieve pet" });
    }
  };

  public findByOwner = async (req: Request, res: Response) => {
    try {
      const ownerId = Number(req.params.ownerId);
      if (Number.isNaN(ownerId)) return res.status(400).json({ error: "Invalid owner ID" });
      const pets = await this.petDao.findByMember(ownerId);
      res.json(pets);
    } catch {
      res.status(500).json({ error: "Unable to retrieve pets" });
    }
  };

  public insert = async (req: Request, res: Response) => {
    try {
      const { id, name, type, birthday, owner } = req.body;

      const all = await this.petDao.findAll();
      const newId = id ?? (all.length ? Math.max(...all.map((p) => p.codePet)) + 1 : 1);

      const pet = new Pet(newId, name, type, birthday, owner);
      const ok = await this.petDao.insert(pet);
      if (!ok) return res.status(500).json({ error: "Failed to create pet" });

      res.status(201).json({ message: "Pet created successfully", pet });
    } catch {
      res.status(500).json({ error: "Unable to create pet" });
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid pet ID" });

      const existing = await this.petDao.findById(id);
      if (!existing) return res.status(404).json({ message: "Pet not found" });

      const { name, type, birthday, owner } = req.body;
      const updated = new Pet(id, name, type, birthday, owner);
      const ok = await this.petDao.update(updated);
      if (!ok) return res.status(500).json({ error: "Failed to update pet" });

      res.json({ message: "Pet updated successfully", pet: updated });
    } catch {
      res.status(500).json({ error: "Unable to update pet" });
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid pet ID" });
      const ok = await this.petDao.delete(id);
      if (!ok) return res.status(404).json({ message: "Pet not found" });
      res.json({ message: "Pet deleted successfully" });
    } catch {
      res.status(500).json({ error: "Unable to delete pet" });
    }
  };
}
