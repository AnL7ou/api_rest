import sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";
import fs from "fs";
import path from "path";

export type SqliteDb = Database<sqlite3.Database, sqlite3.Statement>;

export async function initDb(): Promise<SqliteDb> {
  const dbDir = path.resolve("./db");
  const dbPath = path.join(dbDir, "skz.db");

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
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

  // Idempotent seed: will not re-insert on restart
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

  // Minimal seed for Position/SubUnit (optional)
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
