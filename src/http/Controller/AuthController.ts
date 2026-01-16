import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import type { UserDao } from "../../persistance/DAO/UserDao.js";
import { User, UserRole } from "../../persistance/Entity/User.js";
import { config } from "../../config.js";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../../middleware/auth.js";

export class AuthController {
  constructor(private users: UserDao) {}

  register = async (req: Request, res: Response) => {
    try {
      const { username, password, email } = req.body;

      if (!username || !password || !email) {
        return res.status(400).json({ error: "Username, password, and email are required" });
      }

      const existingUser = await this.users.findByUsername(username);
      if (existingUser) return res.status(409).json({ error: "Username already exists" });

      const existingEmail = await this.users.findByEmail(email);
      if (existingEmail) return res.status(409).json({ error: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);

      const allUsers = await this.users.findAll();
      const isFirstUser = allUsers.length === 0;
      const newId = isFirstUser ? 1 : Math.max(...allUsers.map((u) => u.id)) + 1;
      const role = isFirstUser ? UserRole.ADMIN : UserRole.USER;

      const newUser = new User(newId, username, hashedPassword, email, role);
      const ok = await this.users.insert(newUser);
      if (!ok) return res.status(500).json({ error: "Unable to register user" });

      res.status(201).json({ message: "User registered successfully", user: newUser.toSafeObject() });
    } catch {
      res.status(500).json({ error: "Unable to register user" });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const user = await this.users.findByUsername(username);
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ error: "Invalid credentials" });

      const payload = { id: user.id, username: user.username, role: user.role };

      res.json({
        message: "Login successful",
        accessToken: generateToken(payload),
        refreshToken: generateRefreshToken(payload),
        user: user.toSafeObject(),
      });
    } catch {
      res.status(500).json({ error: "Unable to login" });
    }
  };

  refresh = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ error: "Refresh token is required" });

      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) return res.status(403).json({ error: "Invalid or expired refresh token" });

      const user = await this.users.findById(decoded.id);
      if (!user) return res.status(403).json({ error: "User not found" });

      const payload = { id: user.id, username: user.username, role: user.role };
      res.json({ accessToken: generateToken(payload) });
    } catch {
      res.status(500).json({ error: "Unable to refresh token" });
    }
  };

  me = async (req: Request, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Not authenticated" });
      const user = await this.users.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user.toSafeObject());
    } catch {
      res.status(500).json({ error: "Unable to fetch user information" });
    }
  };
}
