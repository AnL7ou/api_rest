import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { MemberDbDao } from './persistance/DbDAO/MemberDbDao.js';
import { PetDbDao } from './persistance/DbDAO/PetDbDao.js';
import { Member } from './persistance/Entity/Member.js';
import { Pet } from './persistance/Entity/Pet.js';
import { createMemberRouter } from './http/routes/members.js';
import { createPetRouter } from './http/routes/pets.js';
import fs from 'fs';
import path from 'path';

// Resolve absolute path for the DB
const dbDir = path.resolve('./db');
const dbPath = path.join(dbDir, 'SkzPets.db');

// Create folder if it doesn't exist
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
});


(async () => {
    const db = await open({
        filename: './db/skz.db',
        driver: sqlite3.Database
    });

    const memberDbDao = new MemberDbDao(db);
    const petDbDao = new PetDbDao(db);

    await db.exec(`CREATE TABLE IF NOT EXISTS Member (
        codeMember INT PRIMARY KEY NOT NULL,
        stageName VARCHAR(100),
        firstName VARCHAR(100),
        lastName VARCHAR(100),
        birthday DATE,
        skzoo VARCHAR(50)
    );`);

    await db.exec(`CREATE TABLE IF NOT EXISTS Pet (
        codePet INT PRIMARY KEY NOT NULL,
        name VARCHAR(100),
        type VARCHAR(100),
        birthday DATE,
        owner INT,
        FOREIGN KEY (owner) REFERENCES Member(codeMember)
    );`);

    // Insert sample data (optionally use try/catch to avoid duplicates)
    await memberDbDao.insert(new Member(1, "BangChan", "Christopher", "Chahn Bahng", "10-03-1997", "Wolf Chan"));
    await petDbDao.insert(new Pet(1, "Berry", "Dog (Royal King Chales Spaniel)", "12-03-2015", 1));
    await memberDbDao.insert(new Member(2, "Lee Know", "Minho", "Lee", "10-25-1998", "Lee Bit"));
    await petDbDao.insert(new Pet(2, "Soonie", "Cat (Korean Shorthair)", "01-10-2011", 2));
    await petDbDao.insert(new Pet(3, "Doongie", "Cat (Korean Shorthair)", "09-13-2013", 2));
    await petDbDao.insert(new Pet(4, "Dori", "Cat (Korean Shorthair)", "12-22-2018", 2));
    await memberDbDao.insert(new Member(3, "Changbin", "Changbin", "Seo", "08-11-1999", "Dwaekki"));
    await memberDbDao.insert(new Member(4, "Hyunjin", "Hyunjin", "Hwang", "03-20-1999", "Jiniret"));
    await petDbDao.insert(new Pet(5, "Kkami", "Dog (Long-Haired Chihuahua)", "02-20-2015", 3));
    await memberDbDao.insert(new Member(5, "Han", "Jisung", "Han", "09-14-2000", "Han Quokka"));
    await petDbDao.insert(new Pet(6, "Bbama", "Dog (Bichon Frise)", "09-01-2015", 5));
    await memberDbDao.insert(new Member(6, "Felix", "Felix", "Lee", "09-15-2000", "Bbokari"));
    await memberDbDao.insert(new Member(7, "Seungmin", "Seungmin", "Kim", "09-22-2000", "PuppyM"));
    await memberDbDao.insert(new Member(8, "I.N", "Jeongin", "Yang", "02-08-2001", "FoxI.Ny"));

    const app = express();
    const port = 3000;

    // Use routers *after* DAOs are ready
    app.use('/', createMemberRouter(memberDbDao));
    app.use('/', createPetRouter(petDbDao));

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})();



