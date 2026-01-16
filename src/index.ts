import express from "express";
import { initDb } from "./dbInit.js";

import { SqliteMemberDao } from "./persistance/DAO/Sqlite/SqliteMemberDao.js";
import { SqlitePetDao } from "./persistance/DAO/Sqlite/SqlitePetDao.js";
import { SqliteUserDao } from "./persistance/DAO/Sqlite/SqliteUserDao.js";
import { SqlitePositionDao } from "./persistance/DAO/Sqlite/SqlitePositionDao.js";
import { SqliteSubUnitDao } from "./persistance/DAO/Sqlite/SqliteSubUnitDao.js";

import { MemberRepositoryFromDao } from "./persistance/Repository/Adapters/MemberRepositoryFromDao.js";
import { PetRepositoryFromDao } from "./persistance/Repository/Adapters/PetRepositoryFromDao.js";
import { UserRepositoryFromDao } from "./persistance/Repository/Adapters/UserRepositoryFromDao.js";
import { PositionRepositoryFromDao } from "./persistance/Repository/Adapters/PositionRepositoryFromDao.js";
import { SubUnitRepositoryFromDao } from "./persistance/Repository/Adapters/SubUnitRepositoryFromDao.js";

import { MemberPositionRepositoryFromDao } from "./persistance/Repository/Adapters/MemberPositionRepositoryFromDao.js";
import { MemberSubUnitRepositoryFromDao } from "./persistance/Repository/Adapters/MemberSubUnitRepositoryFromDao.js";

import { createMemberRouter } from "./http/routes/members.js";
import { createPetRouter } from "./http/routes/pets.js";
import { createAuthRouter } from "./http/routes/authentification.js";
import { createUserRouter } from "./http/routes/user.js";
import { createPositionRouter } from "./http/routes/position.js";
import { createSubUnitRouter } from "./http/routes/sub_unit.js";
import { SqliteMemberSubUnitDao } from "./persistance/DAO/Sqlite/SqliteMemberSubUnitDao.js";
import { SqliteMemberPositionDao } from "./persistance/DAO/Sqlite/SqliteMemberPositionDao.js";

const port = 3000;

async function main() {
  const db = await initDb();

  const memberDao = new SqliteMemberDao(db);
  const petDao = new SqlitePetDao(db);
  const userDao = new SqliteUserDao(db);
  const positionDao = new SqlitePositionDao(db);
  const subUnitDao = new SqliteSubUnitDao(db);

  const memberPositionDao = new SqliteMemberPositionDao(db);
  const memberSubUnitDao = new SqliteMemberSubUnitDao(db);

  const members = new MemberRepositoryFromDao(memberDao);
  const pets = new PetRepositoryFromDao(petDao);
  const users = new UserRepositoryFromDao(userDao);
  const positions = new PositionRepositoryFromDao(positionDao);
  const subUnits = new SubUnitRepositoryFromDao(subUnitDao);
  const memberPositions = new MemberPositionRepositoryFromDao(memberPositionDao);
  const memberSubUnits = new MemberSubUnitRepositoryFromDao(memberSubUnitDao);

  const app = express();
  app.use(express.json());

  app.use("/api", createMemberRouter(members));
  app.use("/api", createPetRouter(pets));
  app.use("/api/auth", createAuthRouter(users));
  app.use("/api", createUserRouter(users));
  app.use("/api", createPositionRouter(positions, memberPositions));
  app.use("/api", createSubUnitRouter(subUnits, memberSubUnits));

  app.listen(port, () => console.log(`Server running on port ${port}`));
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
