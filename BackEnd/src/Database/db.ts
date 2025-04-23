import { Pool } from "pg";

const db = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  connectionString: process.env.DATABASE_URL
});

db
  .connect()
  .catch((e: unknown) =>  {
    if (e instanceof Error) {
      console.error(`Error connecting to Postgres server:\n${e.message}`);
    } else {
      console.error(`Unexpected error connecting to Postgres server:\n${e}`);
    }
  });

export default db;