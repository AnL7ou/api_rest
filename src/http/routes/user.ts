import express from "express";
import type { UserRepository } from "../../persistance/Repository/UserRepository.js";
import { authenticateToken, authorizeOwnerOrAdmin, authorizeRoles } from "../../middleware/auth.js";
import { UserRole } from "../../persistance/Entity/User.js";
import { UserController } from "../Controller/UserController.js";

export function createUserRouter(users: UserRepository) {
  const router = express.Router();
  const controller = new UserController(users);

  router.get("/users", authenticateToken, authorizeRoles(UserRole.ADMIN), controller.findAll);
  router.get("/users/:id", authenticateToken, authorizeOwnerOrAdmin, controller.findById);
  router.put("/users/:id", authenticateToken, authorizeOwnerOrAdmin, controller.update);
  router.delete("/users/:id", authenticateToken, authorizeRoles(UserRole.ADMIN), controller.delete);

  return router;
}
