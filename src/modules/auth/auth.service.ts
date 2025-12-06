import { pool } from "../../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config/config";

const signUp = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string
) => {
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }
  const hashedPassword = bcrypt.hashSync(password as string, 10);
  const res = await pool.query(
    `INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [name, email, hashedPassword, phone, role]
  );
  return res;
};

const signIn = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  if (result.rowCount === 0) {
    throw new Error("Invalid email or password");
  }
  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(payload, config.secrete as string, {
    expiresIn: "7d",
  });

  return { user, token };
};

export const Service = {
  signIn,
  signUp,
};
