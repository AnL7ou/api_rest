import express from "express";
import type { PetRepository } from "../../persistance/Repository/PetRepository.js";
import { PetController } from "../Controller/PetController.js";

export function createPetRouter(petRepository: PetRepository) {
  const router = express.Router();
  const controller = new PetController(petRepository);

  router.get("/pets", controller.findAll);
  router.get("/pets/owner/:ownerId", controller.findByOwner);
  router.post("/pets", controller.insert);
  router.put("/pets/:id", controller.update);
  router.delete("/pets/:id", controller.delete);

  return router;
}
