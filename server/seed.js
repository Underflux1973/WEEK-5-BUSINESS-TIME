import { db } from "./server.js";

db.query(`CREATE TABLE IF NOT EXISTS data(
    id SERIAL PRIMARY KEY,
    name TEXT,
    location TEXT,
    message_post VARCHAR(255)
    )`);

db.query(`INSERT INTO data(name, location, message_post)
    VALUES ('Bob Geldof', 'Ireland', 'I Dont like mondays')`);
