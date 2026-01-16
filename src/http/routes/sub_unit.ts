import express from "express";
import type { SubUnitRepository } from "../../persistance/Repository/SubUnitRepository.js";
import type { MemberSubUnitRepository } from "../../persistance/Repository/MemberSubUnitRepository.js";
import { authenticateToken, authorizeRoles } from "../../middleware/auth.js";
import { UserRole } from "../../persistance/Entity/User.js";
import { SubUnitController } from "../Controller/SubUnitController.js";

export function createSubUnitRouter(
  subUnits: SubUnitRepository,
  memberSubUnits: MemberSubUnitRepository
) {
  const router = express.Router();
  const controller = new SubUnitController(subUnits, memberSubUnits);

  router.get("/sub-units", authenticateToken, controller.findAll);
  router.get("/sub-units/:id", authenticateToken, controller.findById);

  router.post("/sub-units", authenticateToken, authorizeRoles(UserRole.ADMIN), controller.create);
  router.put("/sub-units/:id", authenticateToken, authorizeRoles(UserRole.ADMIN), controller.update);
  router.delete("/sub-units/:id", authenticateToken, authorizeRoles(UserRole.ADMIN), controller.delete);

  router.post(
    "/sub-units/:id/members/:memberId",
    authenticateToken,
    authorizeRoles(UserRole.ADMIN),
    controller.addMember
  );
  router.delete(
    "/sub-units/:id/members/:memberId",
    authenticateToken,
    authorizeRoles(UserRole.ADMIN),
    controller.removeMember
  );
  router.get("/sub-units/:id/members", authenticateToken, controller.members);

  return router;
}
