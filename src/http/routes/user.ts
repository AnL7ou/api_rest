import express from "express";
import type { UserDao } from "../../persistance/DAO/UserDao.js";
import { authenticateToken, authorizeOwnerOrAdmin, authorizeRoles } from "../../middleware/auth.js";
import { UserRole } from "../../persistance/Entity/User.js";
import { UserController } from "../Controller/UserController.js";

export function createUserRouter(userDao: UserDao) {
  const router = express.Router();
  const controller = new UserController(userDao);

  router.get("/users", authenticateToken, authorizeRoles(UserRole.ADMIN), controller.findAll);
  router.get("/users/:id", authenticateToken, authorizeOwnerOrAdmin, controller.findById);
  router.put("/users/:id", authenticateToken, authorizeOwnerOrAdmin, controller.update);
  router.delete("/users/:id", authenticateToken, authorizeRoles(UserRole.ADMIN), controller.delete);

  return router;
}
