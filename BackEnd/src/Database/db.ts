//PRODUCTION
import { Pool } from "pg";

const db = new Pool({
  connectionString: process.env.DATABASE_URL, // ✅ Use single env var
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

db.connect().catch((e: unknown) => {
  if (e instanceof Error) {
    console.error(`Error connecting to PostgreSQL:\n${e.message}`);
  } else {
    console.error(`Unknown Database error:\n${e}`);
  }
});

export default db;

// DEVELOPMENT
// 
// import { Pool } from "pg";

// const db = new Pool({
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   port: Number(process.env.DB_PORT),
// });

// db
//   .connect()
//   .catch((e: unknown) =>  {
//     if (e instanceof Error) {
//       console.error(`Error connecting to Postgres server:\n${e.message}`);
//     } else {
//       console.error(`Unexpected error connecting to Postgres server:\n${e}`);
//     }
//   });

// export default db;