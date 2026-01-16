// src/index.ts
import express7 from "express";

// src/dbInit.ts
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
async function initDb() {
  const dbDir = path.resolve("./db");
  const dbPath = path.join(dbDir, "skz.db");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Member (
      codeMember INTEGER PRIMARY KEY NOT NULL,
      stageName TEXT,
      firstName TEXT,
      lastName TEXT,
      birthday TEXT,
      skzoo TEXT
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Pet (
      codePet INTEGER PRIMARY KEY NOT NULL,
      name TEXT,
      type TEXT,
      birthday TEXT,
      owner INTEGER,
      FOREIGN KEY (owner) REFERENCES Member(codeMember)
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Position (
      codePosition INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS SubUnit (
      codeSubUnit INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Member_Position (
      memberId INTEGER NOT NULL,
      positionId INTEGER NOT NULL,
      PRIMARY KEY (memberId, positionId),
      FOREIGN KEY (memberId) REFERENCES Member(codeMember) ON DELETE CASCADE,
      FOREIGN KEY (positionId) REFERENCES Position(codePosition) ON DELETE CASCADE
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Member_SubUnit (
      memberId INTEGER NOT NULL,
      subUnitId INTEGER NOT NULL,
      PRIMARY KEY (memberId, subUnitId),
      FOREIGN KEY (memberId) REFERENCES Member(codeMember) ON DELETE CASCADE,
      FOREIGN KEY (subUnitId) REFERENCES SubUnit(codeSubUnit) ON DELETE CASCADE
    );
  `);
  await db.exec(`
    INSERT OR IGNORE INTO Member (codeMember, stageName, firstName, lastName, birthday, skzoo) VALUES
      (1, 'BangChan', 'Christopher', 'Chahn Bahng', '10-03-1997', 'Wolf Chan'),
      (2, 'Lee Know', 'Minho', 'Lee', '10-25-1998', 'Lee Bit'),
      (3, 'Changbin', 'Changbin', 'Seo', '08-11-1999', 'Dwaekki'),
      (4, 'Hyunjin', 'Hyunjin', 'Hwang', '03-20-1999', 'Jiniret'),
      (5, 'Han', 'Jisung', 'Han', '09-14-2000', 'Han Quokka'),
      (6, 'Felix', 'Felix', 'Lee', '09-15-2000', 'Bbokari'),
      (7, 'Seungmin', 'Seungmin', 'Kim', '09-22-2000', 'PuppyM'),
      (8, 'I.N', 'Jeongin', 'Yang', '02-08-2001', 'FoxI.Ny');
  `);
  await db.exec(`
    INSERT OR IGNORE INTO Pet (codePet, name, type, birthday, owner) VALUES
      (1, 'Berry', 'Dog (Royal King Chales Spaniel)', '12-03-2015', 1),
      (2, 'Soonie', 'Cat (Korean Shorthair)', '01-10-2011', 2),
      (3, 'Doongie', 'Cat (Korean Shorthair)', '09-13-2013', 2),
      (4, 'Dori', 'Cat (Korean Shorthair)', '12-22-2018', 2),
      (5, 'Kkami', 'Dog (Long-Haired Chihuahua)', '02-20-2015', 3),
      (6, 'Bbama', 'Dog (Bichon Frise)', '09-01-2015', 5);
  `);
  await db.exec(`
    INSERT OR IGNORE INTO Position (codePosition, name) VALUES
      (1, 'Leader'),
      (2, 'Rapper'),
      (3, 'Vocalist'),
      (4, 'Dancer');
  `);
  await db.exec(`
    INSERT OR IGNORE INTO SubUnit (codeSubUnit, name) VALUES
      (1, '3RACHA'),
      (2, 'Danceracha'),
      (3, 'Vocalracha');
  `);
  return db;
}

// src/persistance/Entity/Member.ts
var Member = class {
  _codeMember;
  _stageName;
  _firstName;
  _lastName;
  _birthday;
  _skzoo;
  constructor(_codeMember, _stageName, _firstName, _lastName, _birthday, _skzoo) {
    this._codeMember = _codeMember;
    this._stageName = _stageName;
    this._firstName = _firstName;
    this._lastName = _lastName;
    this._birthday = _birthday;
    this._skzoo = _skzoo;
  }
  get codeMember() {
    return this._codeMember;
  }
  set codeMember(_codeMember) {
    this._codeMember = _codeMember;
  }
  get stageName() {
    return this._stageName;
  }
  set stageName(_stageName) {
    this._stageName = _stageName;
  }
  get firstName() {
    return this._firstName;
  }
  set firstName(_firstName) {
    this._firstName = _firstName;
  }
  get lastName() {
    return this._lastName;
  }
  set lastName(_lastName) {
    this._lastName = _lastName;
  }
  get birthday() {
    return this._birthday;
  }
  set birthday(_birthday) {
    this._birthday = _birthday;
  }
  get skzoo() {
    return this._skzoo;
  }
  set skzoo(_skzoo) {
    this._skzoo = _skzoo;
  }
};

// src/persistance/DAO/Sqlite/SqliteMemberDao.ts
var SqliteMemberDao = class {
  constructor(db) {
    this.db = db;
  }
  async insert(member) {
    const r = await this.db.run(
      `INSERT OR IGNORE INTO Member (codeMember, stageName, firstName, lastName, birthday, skzoo)
       VALUES (?, ?, ?, ?, ?, ?);`,
      member.codeMember,
      member.stageName,
      member.firstName,
      member.lastName,
      member.birthday,
      member.skzoo
    );
    return (r.changes ?? 0) > 0;
  }
  async update(member) {
    const r = await this.db.run(
      `UPDATE Member
       SET stageName = ?, firstName = ?, lastName = ?, birthday = ?, skzoo = ?
       WHERE codeMember = ?;`,
      member.stageName,
      member.firstName,
      member.lastName,
      member.birthday,
      member.skzoo,
      member.codeMember
    );
    return (r.changes ?? 0) > 0;
  }
  async delete(id) {
    const r = await this.db.run(`DELETE FROM Member WHERE codeMember = ?;`, id);
    return (r.changes ?? 0) > 0;
  }
  async findAll() {
    const rows = await this.db.all(`SELECT * FROM Member;`);
    return rows.map(
      (r) => new Member(r.codeMember, r.stageName, r.firstName, r.lastName, r.birthday, r.skzoo)
    );
  }
  async findById(id) {
    const r = await this.db.get(`SELECT * FROM Member WHERE codeMember = ?;`, id);
    if (!r) return null;
    return new Member(r.codeMember, r.stageName, r.firstName, r.lastName, r.birthday, r.skzoo);
  }
};

// src/persistance/Entity/Pet.ts
var Pet = class {
  _codePet;
  _name;
  _type;
  _birthday;
  _owner;
  constructor(_codePet, _name, _type, _birthday, _owner) {
    this._codePet = _codePet;
    this._name = _name;
    this._type = _type;
    this._birthday = _birthday;
    this._owner = _owner;
  }
  get codePet() {
    return this._codePet;
  }
  set codePet(_codePet) {
    this._codePet = _codePet;
  }
  get name() {
    return this._name;
  }
  set name(_name) {
    this._name = _name;
  }
  get type() {
    return this._type;
  }
  set type(_type) {
    this._type = _type;
  }
  get birthday() {
    return this._birthday;
  }
  set birthday(_birthday) {
    this._birthday = _birthday;
  }
  get owner() {
    return this._owner;
  }
  set owner(_owner) {
    this._owner = _owner;
  }
};

// src/persistance/DAO/Sqlite/SqlitePetDao.ts
var SqlitePetDao = class {
  constructor(db) {
    this.db = db;
  }
  async insert(pet) {
    const r = await this.db.run(
      `INSERT OR IGNORE INTO Pet (codePet, name, type, birthday, owner)
       VALUES (?, ?, ?, ?, ?);`,
      pet.codePet,
      pet.name,
      pet.type,
      pet.birthday,
      pet.owner
    );
    return (r.changes ?? 0) > 0;
  }
  async update(pet) {
    const r = await this.db.run(
      `UPDATE Pet
       SET name = ?, type = ?, birthday = ?, owner = ?
       WHERE codePet = ?;`,
      pet.name,
      pet.type,
      pet.birthday,
      pet.owner,
      pet.codePet
    );
    return (r.changes ?? 0) > 0;
  }
  async delete(id) {
    const r = await this.db.run(`DELETE FROM Pet WHERE codePet = ?;`, id);
    return (r.changes ?? 0) > 0;
  }
  async findAll() {
    const rows = await this.db.all(`SELECT * FROM Pet;`);
    return rows.map((r) => new Pet(r.codePet, r.name, r.type, r.birthday, r.owner));
  }
  async findById(id) {
    const r = await this.db.get(`SELECT * FROM Pet WHERE codePet = ?;`, id);
    if (!r) return null;
    return new Pet(r.codePet, r.name, r.type, r.birthday, r.owner);
  }
  async findByMember(memberId) {
    const rows = await this.db.all(`SELECT * FROM Pet WHERE owner = ?;`, memberId);
    return rows.map((r) => new Pet(r.codePet, r.name, r.type, r.birthday, r.owner));
  }
};

// src/persistance/Entity/Position.ts
var Position = class {
  _codePosition;
  _name;
  constructor(_codePosition, _name) {
    this._codePosition = _codePosition;
    this._name = _name;
  }
  get codePosition() {
    return this._codePosition;
  }
  set codePosition(_codePosition) {
    this._codePosition = _codePosition;
  }
  get name() {
    return this._name;
  }
  set name(_name) {
    this._name = _name;
  }
};

// src/persistance/DAO/Sqlite/SqlitePositionDao.ts
var SqlitePositionDao = class {
  constructor(db) {
    this.db = db;
  }
  async insert(position) {
    const r = await this.db.run(
      `INSERT OR IGNORE INTO Position (codePosition, name) VALUES (?, ?);`,
      position.codePosition,
      position.name
    );
    return (r.changes ?? 0) > 0;
  }
  async update(position) {
    const r = await this.db.run(
      `UPDATE Position SET name = ? WHERE codePosition = ?;`,
      position.name,
      position.codePosition
    );
    return (r.changes ?? 0) > 0;
  }
  async delete(id) {
    const r = await this.db.run(`DELETE FROM Position WHERE codePosition = ?;`, id);
    return (r.changes ?? 0) > 0;
  }
  async findAll() {
    const rows = await this.db.all(`SELECT * FROM Position;`);
    return rows.map((r) => new Position(r.codePosition, r.name));
  }
  async findById(id) {
    const r = await this.db.get(`SELECT * FROM Position WHERE codePosition = ?;`, id);
    if (!r) return null;
    return new Position(r.codePosition, r.name);
  }
};

// src/persistance/Entity/SubUnit.ts
var SubUnit = class {
  _codeSubUnit;
  _name;
  constructor(_codeSubUnit, _name) {
    this._codeSubUnit = _codeSubUnit;
    this._name = _name;
  }
  get codeSubUnit() {
    return this._codeSubUnit;
  }
  set codeSubUnit(_codeSubUnit) {
    this._codeSubUnit = _codeSubUnit;
  }
  get name() {
    return this._name;
  }
  set name(_name) {
    this._name = _name;
  }
};

// src/persistance/DAO/Sqlite/SqliteSubUnitDao.ts
var SqliteSubUnitDao = class {
  constructor(db) {
    this.db = db;
  }
  async insert(subUnit) {
    const r = await this.db.run(
      `INSERT OR IGNORE INTO SubUnit (codeSubUnit, name) VALUES (?, ?);`,
      subUnit.codeSubUnit,
      subUnit.name
    );
    return (r.changes ?? 0) > 0;
  }
  async update(subUnit) {
    const r = await this.db.run(
      `UPDATE SubUnit SET name = ? WHERE codeSubUnit = ?;`,
      subUnit.name,
      subUnit.codeSubUnit
    );
    return (r.changes ?? 0) > 0;
  }
  async delete(id) {
    const r = await this.db.run(`DELETE FROM SubUnit WHERE codeSubUnit = ?;`, id);
    return (r.changes ?? 0) > 0;
  }
  async findAll() {
    const rows = await this.db.all(`SELECT * FROM SubUnit;`);
    return rows.map((r) => new SubUnit(r.codeSubUnit, r.name));
  }
  async findById(id) {
    const r = await this.db.get(`SELECT * FROM SubUnit WHERE codeSubUnit = ?;`, id);
    if (!r) return null;
    return new SubUnit(r.codeSubUnit, r.name);
  }
};

// src/persistance/Entity/User.ts
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["ADMIN"] = "admin";
  UserRole2["USER"] = "user";
  return UserRole2;
})(UserRole || {});
var User = class {
  _id;
  _username;
  _password;
  _email;
  _role;
  _createdAt;
  constructor(id, username, password, email, role = "user" /* USER */, createdAt = (/* @__PURE__ */ new Date()).toISOString()) {
    this._id = id;
    this._username = username;
    this._password = password;
    this._email = email;
    this._role = role;
    this._createdAt = createdAt;
  }
  get id() {
    return this._id;
  }
  set id(id) {
    this._id = id;
  }
  get username() {
    return this._username;
  }
  set username(username) {
    this._username = username;
  }
  get password() {
    return this._password;
  }
  set password(password) {
    this._password = password;
  }
  get email() {
    return this._email;
  }
  set email(email) {
    this._email = email;
  }
  get role() {
    return this._role;
  }
  set role(role) {
    this._role = role;
  }
  get createdAt() {
    return this._createdAt;
  }
  set createdAt(createdAt) {
    this._createdAt = createdAt;
  }
  // Méthode pour retourner l'utilisateur sans le mot de passe
  toSafeObject() {
    return {
      id: this._id,
      username: this._username,
      email: this._email,
      role: this._role,
      createdAt: this._createdAt
    };
  }
};

// src/persistance/DAO/Sqlite/SqliteUserDao.ts
var SqliteUserDao = class {
  constructor(db) {
    this.db = db;
  }
  async insert(user) {
    const r = await this.db.run(
      `INSERT OR IGNORE INTO User (id, username, password, email, role, createdAt)
       VALUES (?, ?, ?, ?, ?, ?);`,
      user.id,
      user.username,
      user.password,
      user.email,
      user.role,
      user.createdAt
    );
    return (r.changes ?? 0) > 0;
  }
  async update(user) {
    const r = await this.db.run(
      `UPDATE User
       SET username = ?, password = ?, email = ?, role = ?
       WHERE id = ?;`,
      user.username,
      user.password,
      user.email,
      user.role,
      user.id
    );
    return (r.changes ?? 0) > 0;
  }
  async delete(id) {
    const r = await this.db.run(`DELETE FROM User WHERE id = ?;`, id);
    return (r.changes ?? 0) > 0;
  }
  async findAll() {
    const rows = await this.db.all(`SELECT * FROM User;`);
    return rows.map((r) => new User(r.id, r.username, r.password, r.email, r.role, r.createdAt));
  }
  async findById(id) {
    const r = await this.db.get(`SELECT * FROM User WHERE id = ?;`, id);
    if (!r) return null;
    return new User(r.id, r.username, r.password, r.email, r.role, r.createdAt);
  }
  async findByUsername(username) {
    const r = await this.db.get(`SELECT * FROM User WHERE username = ?;`, username);
    if (!r) return null;
    return new User(r.id, r.username, r.password, r.email, r.role, r.createdAt);
  }
  async findByEmail(email) {
    const r = await this.db.get(`SELECT * FROM User WHERE email = ?;`, email);
    if (!r) return null;
    return new User(r.id, r.username, r.password, r.email, r.role, r.createdAt);
  }
};

// src/persistance/DAO/Sqlite/SqliteMemberPositionDao.ts
var SqliteMemberPositionDao = class {
  constructor(db) {
    this.db = db;
  }
  async add(memberId, positionId) {
    const r = await this.db.run(
      `INSERT OR IGNORE INTO Member_Position (memberId, positionId) VALUES (?, ?);`,
      memberId,
      positionId
    );
    return (r.changes ?? 0) > 0;
  }
  async remove(memberId, positionId) {
    const r = await this.db.run(
      `DELETE FROM Member_Position WHERE memberId = ? AND positionId = ?;`,
      memberId,
      positionId
    );
    return (r.changes ?? 0) > 0;
  }
  async findPositionsByMember(memberId) {
    const rows = await this.db.all(
      `SELECT p.* FROM Position p
       INNER JOIN Member_Position mp ON mp.positionId = p.codePosition
       WHERE mp.memberId = ?;`,
      memberId
    );
    return rows.map((r) => new Position(r.codePosition, r.name));
  }
  async findMembersByPosition(positionId) {
    const rows = await this.db.all(
      `SELECT memberId FROM Member_Position WHERE positionId = ?;`,
      positionId
    );
    return rows.map((r) => r.memberId);
  }
};

// src/persistance/DAO/Sqlite/SqliteMemberSubUnitDao.ts
var SqliteMemberSubUnitDao = class {
  constructor(db) {
    this.db = db;
  }
  async add(memberId, subUnitId) {
    const r = await this.db.run(
      `INSERT OR IGNORE INTO Member_SubUnit (memberId, subUnitId) VALUES (?, ?);`,
      memberId,
      subUnitId
    );
    return (r.changes ?? 0) > 0;
  }
  async remove(memberId, subUnitId) {
    const r = await this.db.run(
      `DELETE FROM Member_SubUnit WHERE memberId = ? AND subUnitId = ?;`,
      memberId,
      subUnitId
    );
    return (r.changes ?? 0) > 0;
  }
  async findSubUnitsByMember(memberId) {
    const rows = await this.db.all(
      `SELECT s.* FROM SubUnit s
       INNER JOIN Member_SubUnit ms ON ms.subUnitId = s.codeSubUnit
       WHERE ms.memberId = ?;`,
      memberId
    );
    return rows.map((r) => new SubUnit(r.codeSubUnit, r.name));
  }
  async findMembersBySubUnit(subUnitId) {
    const rows = await this.db.all(
      `SELECT memberId FROM Member_SubUnit WHERE subUnitId = ?;`,
      subUnitId
    );
    return rows.map((r) => r.memberId);
  }
};

// src/http/routes/members.ts
import express from "express";

// src/http/Controller/MemberController.ts
var MemberController = class {
  constructor(memberDao) {
    this.memberDao = memberDao;
  }
  findAll = async (_req, res) => {
    try {
      const members = await this.memberDao.findAll();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Unable to retrieve members" });
    }
  };
  findById = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid member ID" });
      const member = await this.memberDao.findById(id);
      if (!member) return res.status(404).json({ message: "Member not found" });
      res.json(member);
    } catch {
      res.status(500).json({ error: "Unable to retrieve member" });
    }
  };
  insert = async (req, res) => {
    try {
      const { id, stageName, firstName, lastName, birthday, skzoo } = req.body;
      const codeMember = id ?? void 0;
      if (codeMember === void 0) {
        const all = await this.memberDao.findAll();
        const newId = all.length ? Math.max(...all.map((m) => m.codeMember)) + 1 : 1;
        const member2 = new Member(newId, stageName, firstName, lastName, birthday, skzoo);
        const ok2 = await this.memberDao.insert(member2);
        if (!ok2) return res.status(500).json({ error: "Failed to create member" });
        return res.status(201).json({ message: "Member created successfully", member: member2 });
      }
      const member = new Member(codeMember, stageName, firstName, lastName, birthday, skzoo);
      const ok = await this.memberDao.insert(member);
      if (!ok) return res.status(500).json({ error: "Failed to create member" });
      res.status(201).json({ message: "Member created successfully", member });
    } catch (error) {
      res.status(500).json({ error: "Unable to create member" });
    }
  };
  update = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid member ID" });
      const existing = await this.memberDao.findById(id);
      if (!existing) return res.status(404).json({ message: "Member not found" });
      const { stageName, firstName, lastName, birthday, skzoo } = req.body;
      const updated = new Member(id, stageName, firstName, lastName, birthday, skzoo);
      const ok = await this.memberDao.update(updated);
      if (!ok) return res.status(500).json({ error: "Failed to update member" });
      res.json({ message: "Member updated successfully", member: updated });
    } catch {
      res.status(500).json({ error: "Unable to update member" });
    }
  };
  delete = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid member ID" });
      const ok = await this.memberDao.delete(id);
      if (!ok) return res.status(404).json({ message: "Member not found" });
      res.json({ message: "Member deleted successfully" });
    } catch {
      res.status(500).json({ error: "Unable to delete member" });
    }
  };
};

// src/http/routes/members.ts
function createMemberRouter(memberDao) {
  const memberController = new MemberController(memberDao);
  const router = express.Router();
  router.get("/members", memberController.findAll);
  router.get("/members/:id", memberController.findById);
  router.post("/members", memberController.insert);
  router.put("/members/:id", memberController.update);
  router.delete("/members/:id", memberController.delete);
  return router;
}

// src/http/routes/pets.ts
import express2 from "express";

// src/http/Controller/PetController.ts
var PetController = class {
  constructor(petDao) {
    this.petDao = petDao;
  }
  findAll = async (_req, res) => {
    try {
      const pets = await this.petDao.findAll();
      res.json(pets);
    } catch {
      res.status(500).json({ error: "Unable to retrieve pets" });
    }
  };
  findById = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid pet ID" });
      const pet = await this.petDao.findById(id);
      if (!pet) return res.status(404).json({ message: "Pet not found" });
      res.json(pet);
    } catch {
      res.status(500).json({ error: "Unable to retrieve pet" });
    }
  };
  findByOwner = async (req, res) => {
    try {
      const ownerId = Number(req.params.ownerId);
      if (Number.isNaN(ownerId)) return res.status(400).json({ error: "Invalid owner ID" });
      const pets = await this.petDao.findByMember(ownerId);
      res.json(pets);
    } catch {
      res.status(500).json({ error: "Unable to retrieve pets" });
    }
  };
  insert = async (req, res) => {
    try {
      const { id, name, type, birthday, owner } = req.body;
      const all = await this.petDao.findAll();
      const newId = id ?? (all.length ? Math.max(...all.map((p) => p.codePet)) + 1 : 1);
      const pet = new Pet(newId, name, type, birthday, owner);
      const ok = await this.petDao.insert(pet);
      if (!ok) return res.status(500).json({ error: "Failed to create pet" });
      res.status(201).json({ message: "Pet created successfully", pet });
    } catch {
      res.status(500).json({ error: "Unable to create pet" });
    }
  };
  update = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid pet ID" });
      const existing = await this.petDao.findById(id);
      if (!existing) return res.status(404).json({ message: "Pet not found" });
      const { name, type, birthday, owner } = req.body;
      const updated = new Pet(id, name, type, birthday, owner);
      const ok = await this.petDao.update(updated);
      if (!ok) return res.status(500).json({ error: "Failed to update pet" });
      res.json({ message: "Pet updated successfully", pet: updated });
    } catch {
      res.status(500).json({ error: "Unable to update pet" });
    }
  };
  delete = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid pet ID" });
      const ok = await this.petDao.delete(id);
      if (!ok) return res.status(404).json({ message: "Pet not found" });
      res.json({ message: "Pet deleted successfully" });
    } catch {
      res.status(500).json({ error: "Unable to delete pet" });
    }
  };
};

// src/http/routes/pets.ts
function createPetRouter(petDao) {
  const router = express2.Router();
  const controller = new PetController(petDao);
  router.get("/pets", controller.findAll);
  router.get("/pets/:id", controller.findById);
  router.get("/pets/owner/:ownerId", controller.findByOwner);
  router.post("/pets", controller.insert);
  router.put("/pets/:id", controller.update);
  router.delete("/pets/:id", controller.delete);
  return router;
}

// src/http/routes/position.ts
import express3 from "express";

// src/middleware/auth.ts
import jwt from "jsonwebtoken";

// src/config.ts
import dotenv from "dotenv";
dotenv.config();
var config = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: "1h",
    // Token expires in 1 hour
    refreshExpiresIn: "7d"
    // Refresh token expires in 7 days
  },
  // Database Configuration
  database: {
    filename: "./db/skz.db"
  },
  // Server Configuration
  server: {
    port: process.env.PORT || 3e3,
    host: process.env.HOST || "localhost"
  },
  // Security
  security: {
    bcryptRounds: 10,
    // Number of salt rounds for bcrypt
    maxLoginAttempts: 5,
    lockoutTime: 15 * 60 * 1e3
    // 15 minutes in milliseconds
  }
};

// src/middleware/auth.ts
function requireJwtSecret() {
  const secret = config.jwt.secret;
  if (!secret) throw new Error("JWT secret is not configured");
  return secret;
}
var authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : void 0;
  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }
  let secret;
  try {
    secret = requireJwtSecret();
  } catch {
    res.status(500).json({ error: "JWT secret is not configured" });
    return;
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({ error: "Token expired" });
        return;
      }
      if (err instanceof jwt.JsonWebTokenError) {
        res.status(403).json({ error: "Invalid token" });
        return;
      }
      res.status(500).json({ error: "Token verification failed" });
      return;
    }
    const payload = decoded;
    req.user = {
      id: payload.id,
      username: payload.username,
      role: payload.role
    };
    next();
  });
};
var authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: "Access forbidden",
        message: `You need one of the following roles: ${roles.join(", ")}`
      });
      return;
    }
    next();
  };
};
var authorizeOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  const requestedUserId = Number(req.params.id);
  if (Number.isNaN(requestedUserId)) {
    res.status(400).json({ error: "Invalid ID parameter" });
    return;
  }
  if (req.user.role === "admin" /* ADMIN */ || req.user.id === requestedUserId) {
    next();
    return;
  }
  res.status(403).json({
    error: "Access forbidden",
    message: "You can only access your own resources"
  });
};
var generateToken = (payload) => {
  const secret = requireJwtSecret();
  const options = {
    expiresIn: config.jwt.expiresIn
  };
  return jwt.sign(payload, secret, options);
};
var generateRefreshToken = (payload) => {
  const secret = requireJwtSecret();
  const options = {
    expiresIn: config.jwt.refreshExpiresIn
  };
  return jwt.sign(payload, secret, options);
};
var verifyRefreshToken = (token) => {
  try {
    const secret = requireJwtSecret();
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};

// src/http/Controller/PositionController.ts
var PositionController = class {
  constructor(positions, memberPositions) {
    this.positions = positions;
    this.memberPositions = memberPositions;
  }
  findAll = async (_, res) => {
    try {
      res.json(await this.positions.findAll());
    } catch {
      res.status(500).json({ error: "Unable to retrieve positions" });
    }
  };
  findById = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid position ID" });
      const position = await this.positions.findById(id);
      if (!position) return res.status(404).json({ error: "Position not found" });
      res.json(position);
    } catch {
      res.status(500).json({ error: "Unable to retrieve position" });
    }
  };
  insert = async (req, res) => {
    try {
      const { id, name } = req.body;
      if (!name) return res.status(400).json({ error: "Name is required" });
      const all = await this.positions.findAll();
      const newId = id ?? (all.length ? Math.max(...all.map((p) => p.codePosition)) + 1 : 1);
      const position = new Position(newId, name);
      const ok = await this.positions.insert(position);
      if (!ok) return res.status(500).json({ error: "Failed to create position" });
      res.status(201).json({ message: "Position created successfully", position });
    } catch {
      res.status(500).json({ error: "Unable to create position" });
    }
  };
  update = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid position ID" });
      const existing = await this.positions.findById(id);
      if (!existing) return res.status(404).json({ error: "Position not found" });
      const { name } = req.body;
      const updated = new Position(id, name ?? existing.name);
      const ok = await this.positions.update(updated);
      if (!ok) return res.status(500).json({ error: "Failed to update position" });
      res.json({ message: "Position updated successfully", position: updated });
    } catch {
      res.status(500).json({ error: "Unable to update position" });
    }
  };
  delete = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid position ID" });
      const ok = await this.positions.delete(id);
      if (!ok) return res.status(404).json({ error: "Position not found" });
      res.json({ message: "Position deleted successfully" });
    } catch {
      res.status(500).json({ error: "Unable to delete position" });
    }
  };
  addMember = async (req, res) => {
    try {
      const positionId = Number(req.params.id);
      const memberId = Number(req.params.memberId);
      if (Number.isNaN(positionId) || Number.isNaN(memberId)) {
        return res.status(400).json({ error: "Invalid position or member ID" });
      }
      const ok = await this.memberPositions.add(memberId, positionId);
      if (!ok) return res.status(500).json({ error: "Failed to add member to position" });
      res.json({ message: "Member added to position successfully" });
    } catch {
      res.status(500).json({ error: "Unable to add member to position" });
    }
  };
  removeMember = async (req, res) => {
    try {
      const positionId = Number(req.params.id);
      const memberId = Number(req.params.memberId);
      if (Number.isNaN(positionId) || Number.isNaN(memberId)) {
        return res.status(400).json({ error: "Invalid position or member ID" });
      }
      const ok = await this.memberPositions.remove(memberId, positionId);
      if (!ok) return res.status(404).json({ error: "Member not in this position" });
      res.json({ message: "Member removed from position successfully" });
    } catch {
      res.status(500).json({ error: "Unable to remove member from position" });
    }
  };
  members = async (req, res) => {
    try {
      const positionId = Number(req.params.id);
      if (Number.isNaN(positionId)) return res.status(400).json({ error: "Invalid position ID" });
      const memberIds = await this.memberPositions.findMembersByPosition(positionId);
      res.json({ positionId, memberIds });
    } catch {
      res.status(500).json({ error: "Unable to retrieve members" });
    }
  };
};

// src/http/routes/position.ts
function createPositionRouter(positionDao, memberPositionDao) {
  const router = express3.Router();
  const controller = new PositionController(positionDao, memberPositionDao);
  router.get("/positions", authenticateToken, controller.findAll);
  router.get("/positions/:id", authenticateToken, controller.findById);
  router.post("/positions", authenticateToken, authorizeRoles("admin" /* ADMIN */), controller.insert);
  router.put("/positions/:id", authenticateToken, authorizeRoles("admin" /* ADMIN */), controller.update);
  router.delete("/positions/:id", authenticateToken, authorizeRoles("admin" /* ADMIN */), controller.delete);
  router.post(
    "/positions/:id/members/:memberId",
    authenticateToken,
    authorizeRoles("admin" /* ADMIN */),
    controller.addMember
  );
  router.delete(
    "/positions/:id/members/:memberId",
    authenticateToken,
    authorizeRoles("admin" /* ADMIN */),
    controller.removeMember
  );
  router.get("/positions/:id/members", authenticateToken, controller.members);
  return router;
}

// src/http/routes/sub_unit.ts
import express4 from "express";

// src/http/Controller/SubUnitController.ts
var SubUnitController = class {
  constructor(subUnits, memberSubUnits) {
    this.subUnits = subUnits;
    this.memberSubUnits = memberSubUnits;
  }
  findAll = async (_, res) => {
    try {
      res.json(await this.subUnits.findAll());
    } catch {
      res.status(500).json({ error: "Unable to retrieve sub-units" });
    }
  };
  findById = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid sub-unit ID" });
      const subUnit = await this.subUnits.findById(id);
      if (!subUnit) return res.status(404).json({ error: "Sub-unit not found" });
      res.json(subUnit);
    } catch {
      res.status(500).json({ error: "Unable to retrieve sub-unit" });
    }
  };
  insert = async (req, res) => {
    try {
      const { id, name } = req.body;
      if (!name) return res.status(400).json({ error: "Name is required" });
      const all = await this.subUnits.findAll();
      const newId = id ?? (all.length ? Math.max(...all.map((s) => s.codeSubUnit)) + 1 : 1);
      const subUnit = new SubUnit(newId, name);
      const ok = await this.subUnits.insert(subUnit);
      if (!ok) return res.status(500).json({ error: "Failed to create sub-unit" });
      res.status(201).json({ message: "Sub-unit created successfully", subUnit });
    } catch {
      res.status(500).json({ error: "Unable to create sub-unit" });
    }
  };
  update = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid sub-unit ID" });
      const existing = await this.subUnits.findById(id);
      if (!existing) return res.status(404).json({ error: "Sub-unit not found" });
      const { name } = req.body;
      const updated = new SubUnit(id, name ?? existing.name);
      const ok = await this.subUnits.update(updated);
      if (!ok) return res.status(500).json({ error: "Failed to update sub-unit" });
      res.json({ message: "Sub-unit updated successfully", subUnit: updated });
    } catch {
      res.status(500).json({ error: "Unable to update sub-unit" });
    }
  };
  delete = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid sub-unit ID" });
      const ok = await this.subUnits.delete(id);
      if (!ok) return res.status(404).json({ error: "Sub-unit not found" });
      res.json({ message: "Sub-unit deleted successfully" });
    } catch {
      res.status(500).json({ error: "Unable to delete sub-unit" });
    }
  };
  addMember = async (req, res) => {
    try {
      const subUnitId = Number(req.params.id);
      const memberId = Number(req.params.memberId);
      if (Number.isNaN(subUnitId) || Number.isNaN(memberId)) {
        return res.status(400).json({ error: "Invalid sub-unit or member ID" });
      }
      const ok = await this.memberSubUnits.add(memberId, subUnitId);
      if (!ok) return res.status(500).json({ error: "Failed to add member to sub-unit" });
      res.json({ message: "Member added to sub-unit successfully" });
    } catch {
      res.status(500).json({ error: "Unable to add member to sub-unit" });
    }
  };
  removeMember = async (req, res) => {
    try {
      const subUnitId = Number(req.params.id);
      const memberId = Number(req.params.memberId);
      if (Number.isNaN(subUnitId) || Number.isNaN(memberId)) {
        return res.status(400).json({ error: "Invalid sub-unit or member ID" });
      }
      const ok = await this.memberSubUnits.remove(memberId, subUnitId);
      if (!ok) return res.status(404).json({ error: "Member not in this sub-unit" });
      res.json({ message: "Member removed from sub-unit successfully" });
    } catch {
      res.status(500).json({ error: "Unable to remove member from sub-unit" });
    }
  };
  members = async (req, res) => {
    try {
      const subUnitId = Number(req.params.id);
      if (Number.isNaN(subUnitId)) return res.status(400).json({ error: "Invalid sub-unit ID" });
      const memberIds = await this.memberSubUnits.findMembersBySubUnit(subUnitId);
      res.json({ subUnitId, memberIds });
    } catch {
      res.status(500).json({ error: "Unable to retrieve members" });
    }
  };
};

// src/http/routes/sub_unit.ts
function createSubUnitRouter(subUnitDao, memberSubUnitDao) {
  const router = express4.Router();
  const controller = new SubUnitController(subUnitDao, memberSubUnitDao);
  router.get("/sub-units", authenticateToken, controller.findAll);
  router.get("/sub-units/:id", authenticateToken, controller.findById);
  router.post("/sub-units", authenticateToken, authorizeRoles("admin" /* ADMIN */), controller.insert);
  router.put("/sub-units/:id", authenticateToken, authorizeRoles("admin" /* ADMIN */), controller.update);
  router.delete("/sub-units/:id", authenticateToken, authorizeRoles("admin" /* ADMIN */), controller.delete);
  router.post(
    "/sub-units/:id/members/:memberId",
    authenticateToken,
    authorizeRoles("admin" /* ADMIN */),
    controller.addMember
  );
  router.delete(
    "/sub-units/:id/members/:memberId",
    authenticateToken,
    authorizeRoles("admin" /* ADMIN */),
    controller.removeMember
  );
  router.get("/sub-units/:id/members", authenticateToken, controller.members);
  return router;
}

// src/http/routes/authentification.ts
import express5 from "express";

// src/http/Controller/AuthController.ts
import bcrypt from "bcrypt";
var AuthController = class {
  constructor(users) {
    this.users = users;
  }
  register = async (req, res) => {
    try {
      const { username, password, email } = req.body;
      if (!username || !password || !email) {
        return res.status(400).json({ error: "Username, password, and email are required" });
      }
      const existingUser = await this.users.findByUsername(username);
      if (existingUser) return res.status(409).json({ error: "Username already exists" });
      const existingEmail = await this.users.findByEmail(email);
      if (existingEmail) return res.status(409).json({ error: "Email already exists" });
      const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);
      const allUsers = await this.users.findAll();
      const isFirstUser = allUsers.length === 0;
      const newId = isFirstUser ? 1 : Math.max(...allUsers.map((u) => u.id)) + 1;
      const role = isFirstUser ? "admin" /* ADMIN */ : "user" /* USER */;
      const newUser = new User(newId, username, hashedPassword, email, role);
      const ok = await this.users.insert(newUser);
      if (!ok) return res.status(500).json({ error: "Unable to register user" });
      res.status(201).json({ message: "User registered successfully", user: newUser.toSafeObject() });
    } catch {
      res.status(500).json({ error: "Unable to register user" });
    }
  };
  login = async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      const user = await this.users.findByUsername(username);
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ error: "Invalid credentials" });
      const payload = { id: user.id, username: user.username, role: user.role };
      res.json({
        message: "Login successful",
        accessToken: generateToken(payload),
        refreshToken: generateRefreshToken(payload),
        user: user.toSafeObject()
      });
    } catch {
      res.status(500).json({ error: "Unable to login" });
    }
  };
  refresh = async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ error: "Refresh token is required" });
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) return res.status(403).json({ error: "Invalid or expired refresh token" });
      const user = await this.users.findById(decoded.id);
      if (!user) return res.status(403).json({ error: "User not found" });
      const payload = { id: user.id, username: user.username, role: user.role };
      res.json({ accessToken: generateToken(payload) });
    } catch {
      res.status(500).json({ error: "Unable to refresh token" });
    }
  };
  me = async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Not authenticated" });
      const user = await this.users.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user.toSafeObject());
    } catch {
      res.status(500).json({ error: "Unable to fetch user information" });
    }
  };
};

// src/http/routes/authentification.ts
function createAuthRouter(userDao) {
  const router = express5.Router();
  const controller = new AuthController(userDao);
  router.post("/auth/register", controller.register);
  router.post("/auth/login", controller.login);
  router.post("/auth/refresh", controller.refresh);
  router.get("/auth/me", authenticateToken, controller.me);
  return router;
}

// src/http/routes/user.ts
import express6 from "express";

// src/http/Controller/UserController.ts
import bcrypt2 from "bcrypt";
var UserController = class {
  constructor(users) {
    this.users = users;
  }
  findAll = async (_, res) => {
    try {
      const all = await this.users.findAll();
      res.json(all.map((u) => u.toSafeObject()));
    } catch {
      res.status(500).json({ error: "Unable to retrieve users" });
    }
  };
  findById = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });
      const user = await this.users.findById(id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user.toSafeObject());
    } catch {
      res.status(500).json({ error: "Unable to retrieve user" });
    }
  };
  delete = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });
      const ok = await this.users.delete(id);
      if (!ok) return res.status(404).json({ error: "User not found" });
      res.json({ message: "User deleted successfully" });
    } catch {
      res.status(500).json({ error: "Unable to delete user" });
    }
  };
  update = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });
      const existing = await this.users.findById(id);
      if (!existing) return res.status(404).json({ error: "User not found" });
      const { username, email, password, role } = req.body;
      if (username && username !== existing.username) {
        const u = await this.users.findByUsername(username);
        if (u && u.id !== id) return res.status(409).json({ error: "Username already taken" });
        existing.username = username;
      }
      if (email && email !== existing.email) {
        const u = await this.users.findByEmail(email);
        if (u && u.id !== id) return res.status(409).json({ error: "Email already taken" });
        existing.email = email;
      }
      if (password) {
        existing.password = await bcrypt2.hash(password, config.security.bcryptRounds);
      }
      if (role && req.user?.role === "admin" /* ADMIN */ && Object.values(UserRole).includes(role)) {
        existing.role = role;
      }
      const ok = await this.users.update(existing);
      if (!ok) return res.status(500).json({ error: "Failed to update user" });
      res.json({ message: "User updated successfully", user: existing.toSafeObject() });
    } catch {
      res.status(500).json({ error: "Unable to update user" });
    }
  };
};

// src/http/routes/user.ts
function createUserRouter(userDao) {
  const router = express6.Router();
  const controller = new UserController(userDao);
  router.get("/users", authenticateToken, authorizeRoles("admin" /* ADMIN */), controller.findAll);
  router.get("/users/:id", authenticateToken, authorizeOwnerOrAdmin, controller.findById);
  router.put("/users/:id", authenticateToken, authorizeOwnerOrAdmin, controller.update);
  router.delete("/users/:id", authenticateToken, authorizeRoles("admin" /* ADMIN */), controller.delete);
  return router;
}

// src/index.ts
var port = 3e3;
async function main() {
  const db = await initDb();
  const sqliteMemberDao = new SqliteMemberDao(db);
  const sqlitePetDao = new SqlitePetDao(db);
  const sqlitePositionDao = new SqlitePositionDao(db);
  const sqliteSubUnitDao = new SqliteSubUnitDao(db);
  const sqliteUserDao = new SqliteUserDao(db);
  const sqliteMemberPositionDao = new SqliteMemberPositionDao(db);
  const sqliteMemberSubUnitDao = new SqliteMemberSubUnitDao(db);
  const app = express7();
  app.use(express7.json());
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
//# sourceMappingURL=index.js.map