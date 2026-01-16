import express from "express";
import type { UserDao } from "../../persistance/DAO/UserDao.js";
import { authenticateToken } from "../../middleware/auth.js";
import { AuthController } from "../Controller/AuthController.js";

export function createAuthRouter(userDao: UserDao) {
  const router = express.Router();
  const controller = new AuthController(userDao);

  router.post("/auth/register", controller.register);
  router.post("/auth/login", controller.login);
  router.post("/auth/refresh", controller.refresh);
  router.get("/auth/me", authenticateToken, controller.me);

  return router;
}
