import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import type { UserDao } from "../../persistance/DAO/UserDao.js";
import { UserRole } from "../../persistance/Entity/User.js";
import { config } from "../../config.js";

export class UserController {
  constructor(private users: UserDao) {}

  findAll = async (_: Request, res: Response) => {
    try {
      const all = await this.users.findAll();
      res.json(all.map((u) => u.toSafeObject()));
    } catch {
      res.status(500).json({ error: "Unable to retrieve users" });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });
      const user = await this.users.findById(id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user.toSafeObject());
    } catch {
      res.status(500).json({ error: "Unable to retrieve user" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });
      const ok = await this.users.delete(id);
      if (!ok) return res.status(404).json({ error: "User not found" });
      res.json({ message: "User deleted successfully" });
    } catch {
      res.status(500).json({ error: "Unable to delete user" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

      const existing = await this.users.findById(id);
      if (!existing) return res.status(404).json({ error: "User not found" });

      const { username, email, password, role } = req.body;

      if (username && username !== existing.username) {
        const u = await this.users.findByUsername(username);
        if (u && u.id !== id) return res.status(409).json({ error: "Username already taken" });
        existing.username = username;
      }

      if (email && email !== existing.email) {
        const u = await this.users.findByEmail(email);
        if (u && u.id !== id) return res.status(409).json({ error: "Email already taken" });
        existing.email = email;
      }

      if (password) {
        existing.password = await bcrypt.hash(password, config.security.bcryptRounds);
      }

      // Only admins can change roles
      if (role && req.user?.role === UserRole.ADMIN && Object.values(UserRole).includes(role)) {
        existing.role = role;
      }

      const ok = await this.users.update(existing);
      if (!ok) return res.status(500).json({ error: "Failed to update user" });

      res.json({ message: "User updated successfully", user: existing.toSafeObject() });
    } catch {
      res.status(500).json({ error: "Unable to update user" });
    }
  };
}
