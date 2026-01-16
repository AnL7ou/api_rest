import express from "express";
import type { UserRepository } from "../../persistance/Repository/UserRepository.js";
import { authenticateToken } from "../../middleware/auth.js";
import { AuthController } from "../Controller/AuthController.js";

export function createAuthRouter(users: UserRepository) {
  const router = express.Router();
  const controller = new AuthController(users);

  router.post("/register", controller.register);
  router.post("/login", controller.login);
  router.post("/refresh", controller.refresh);
  router.get("/me", authenticateToken, controller.me);

  return router;
}
