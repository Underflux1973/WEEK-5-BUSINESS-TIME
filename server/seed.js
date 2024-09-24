import { db } from "./server.js";

db.query(`CREATE TABLE IF NOT EXISTS data(
    id SERIAL PRIMARY KEY,
    name TEXT,
    location TEXT,
    message_post VARCHAR(255)
    )`);
