import express from "express";
import type { PositionRepository } from "../../persistance/Repository/PositionRepository.js";
import type { MemberPositionRepository } from "../../persistance/Repository/MemberPositionRepository.js";
import { authenticateToken, authorizeRoles } from "../../middleware/auth.js";
import { UserRole } from "../../persistance/Entity/User.js";
import { PositionController } from "../Controller/PositionController.js";

export function createPositionRouter(
  positions: PositionRepository,
  memberPositions: MemberPositionRepository
) {
  const router = express.Router();
  const controller = new PositionController(positions, memberPositions);

  router.get("/positions", authenticateToken, controller.findAll);
  router.get("/positions/:id", authenticateToken, controller.findById);

  router.post("/positions", authenticateToken, authorizeRoles(UserRole.ADMIN), controller.insert);
  router.put("/positions/:id", authenticateToken, authorizeRoles(UserRole.ADMIN), controller.update);
  router.delete("/positions/:id", authenticateToken, authorizeRoles(UserRole.ADMIN), controller.delete);

  router.post(
    "/positions/:id/members/:memberId",
    authenticateToken,
    authorizeRoles(UserRole.ADMIN),
    controller.addMember
  );
  router.delete(
    "/positions/:id/members/:memberId",
    authenticateToken,
    authorizeRoles(UserRole.ADMIN),
    controller.removeMember
  );
  router.get("/positions/:id/members", authenticateToken, controller.members);

  return router;
}
