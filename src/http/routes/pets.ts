import express from "express";
import type { PetDao } from "../../persistance/DAO/PetDao.js";
import { PetController } from "../Controller/PetController.js";

export function createPetRouter(petDao: PetDao) {
  const router = express.Router();
  const controller = new PetController(petDao);

  router.get("/pets", controller.findAll);
  router.get("/pets/:id", controller.findById);
  router.get("/pets/owner/:ownerId", controller.findByOwner);
  router.post("/pets", controller.insert);
  router.put("/pets/:id", controller.update);
  router.delete("/pets/:id", controller.delete);

  return router;
}
