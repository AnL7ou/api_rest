import type { Request, Response } from "express";
import type { PetRepository } from "../../persistance/Repository/PetRepository.js";
import { Pet } from "../../persistance/Entity/Pet.js";

export class PetController {
  constructor(private petRepository: PetRepository) {}

  public findAll = async (_req: Request, res: Response) => {
    try {
      const pets = await this.petRepository.findAll();
      res.json(pets);
    } catch {
      res.status(500).json({ error: "Unable to retrieve pets" });
    }
  };

  public findByOwner = async (req: Request, res: Response) => {
    try {
      const ownerId = Number(req.params.ownerId);
      if (Number.isNaN(ownerId)) return res.status(400).json({ error: "Invalid owner ID" });

      const pets = await this.petRepository.findByOwner(ownerId);
      res.json(pets);
    } catch {
      res.status(500).json({ error: "Unable to retrieve pets by owner" });
    }
  };

  public insert = async (req: Request, res: Response) => {
    try {
      const { name, type, birthday, owner } = req.body;
      const newPet = new Pet(undefined as any, name, type, birthday, owner);

      const ok = await this.petRepository.insert(newPet);
      if (!ok) return res.status(500).json({ error: "Failed to create pet" });

      res.status(201).json({ message: "Pet created successfully", pet: newPet });
    } catch {
      res.status(500).json({ error: "Unable to create pet" });
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid pet ID" });

      const existing = await this.petRepository.findById(id);
      if (!existing) return res.status(404).json({ message: "Pet not found" });

      const { name, type, birthday, owner } = req.body;
      const updated = new Pet(id, name, type, birthday, owner);

      const ok = await this.petRepository.update(updated);
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

      const ok = await this.petRepository.delete(id);
      if (!ok) return res.status(404).json({ message: "Pet not found" });

      res.json({ message: "Pet deleted successfully" });
    } catch {
      res.status(500).json({ error: "Unable to delete pet" });
    }
  };
}
