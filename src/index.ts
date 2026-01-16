import express from "express";
import { initDb } from "./dbInit.js";
import { SqliteMemberDao } from "./persistance/DAO/Sqlite/SqliteMemberDao.js";
import { SqlitePetDao } from "./persistance/DAO/Sqlite/SqlitePetDao.js";
import { SqlitePositionDao } from "./persistance/DAO/Sqlite/SqlitePositionDao.js";
import { SqliteSubUnitDao } from "./persistance/DAO/Sqlite/SqliteSubUnitDao.js";
import { SqliteUserDao } from "./persistance/DAO/Sqlite/SqliteUserDao.js";
import { SqliteMemberPositionDao } from "./persistance/DAO/Sqlite/SqliteMemberPositionDao.js";
import { SqliteMemberSubUnitDao } from "./persistance/DAO/Sqlite/SqliteMemberSubUnitDao.js";
import { createMemberRouter } from "./http/routes/members.js";
import { createPetRouter } from "./http/routes/pets.js";
import { createPositionRouter } from "./http/routes/position.js";
import { createSubUnitRouter } from "./http/routes/sub_unit.js";
import { createAuthRouter } from "./http/routes/authentification.js";
import { createUserRouter } from "./http/routes/user.js";

const port = 3000;

async function main() {
  const db = await initDb();

  const sqliteMemberDao = new SqliteMemberDao(db);
  const sqlitePetDao = new SqlitePetDao(db);
  const sqlitePositionDao = new SqlitePositionDao(db);
  const sqliteSubUnitDao = new SqliteSubUnitDao(db);
  const sqliteUserDao = new SqliteUserDao(db);
  const sqliteMemberPositionDao = new SqliteMemberPositionDao(db);
  const sqliteMemberSubUnitDao = new SqliteMemberSubUnitDao(db);

  const app = express();
  app.use(express.json());

  app.use("/api", createMemberRouter(sqliteMemberDao));
  app.use("/api", createPetRouter(sqlitePetDao));
  app.use("/api", createAuthRouter(sqliteUserDao));
  app.use("/api", createUserRouter(sqliteUserDao));
  app.use("/api", createPositionRouter(sqlitePositionDao, sqliteMemberPositionDao));
  app.use("/api", createSubUnitRouter(sqliteSubUnitDao, sqliteMemberSubUnitDao));

  app.listen(port, () => console.log(`Server running on port ${port}`));
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
