import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_CA_CERTIFICATE,
  },
});

export const checkDBConnection = async () => {
  try {
    await pool.query("SELECT current_database(), current_user, now();");
    console.log("Database connected.");
  } catch (e: any) {
    console.log("Database connection failed.");
    throw new Error(`Error connecting to database: ${e.message}`);
  }
};

export default pool;
