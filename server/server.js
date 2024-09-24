import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();

app.use(cors());

app.use(express.json());

dotenv.config();

const dbConnectionString = process.env.DATABASE_URL;
export const db = new pg.Pool({
  connectionString: dbConnectionString,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({ message: "This is my root route" });
});

app.get("/data", async (req, res) => {
  const query = await db.query(`SELECT * FROM data`);
  res.json(query.rows);
  console.log(query);
});

app.post("/add-data", function (req, res) {
  const data = req.body;

  res.json({ status: "Data received" });
});
