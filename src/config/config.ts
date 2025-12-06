import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
const config = {
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT,
  secrete: process.env.JWT_SECRETE,
};

export default config;
