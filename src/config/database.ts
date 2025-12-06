import { Pool } from "pg";
import config from "./config";

export const pool = new Pool({ connectionString: config.database_url });

async function initDB() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS
     users(
     id SERIAL PRIMARY KEY,
     name VARCHAR(100)NOT NULL,
     email VARCHAR(200) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL,
     phone VARCHAR(100)NOT NULL,
     role VARCHAR(20) NOT NULL CHECK (role IN ('admin','customer')),
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
     )`
  );
}
export default initDB;
