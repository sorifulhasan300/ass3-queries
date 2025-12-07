import { pool } from "../../config/database";

const getUsers = async () => {
  const result = await pool.query("SELECT * FROM users");
  if (result.rowCount === 0) {
    throw new Error("Users Not Found");
  }
  return result.rows;
};

const updateUser = async (
  id: string,
  name: string,
  email: string,
  phone: string,
  role: string
) => {
  const roleValid = role || "customer";
  const result = await pool.query(
    `UPDATE users
   SET
     name = COALESCE($1, name),
     email = COALESCE($2, email),
     phone = COALESCE($3, phone),
     role = COALESCE($4, role)
   WHERE id = $5
   RETURNING id,name,email,phone,role`,
    [name || null, email || null, phone || null, role || null, id]
  );
  if (result.rowCount === 0) {
    throw new Error("User Update Unsuccessfully");
  }
  return result;
};
const deleteUser = async (id: string) => {
  const res = await pool.query(
    "SELECT COUNT(*) AS count FROM bookings WHERE customer_id=$1 AND status='active'",
    [id]
  );
  const activeCount = Number(res.rows[0].count);

  if (activeCount > 0) {
    throw new Error(
      "User cannot be deleted because they have active bookings."
    );
  }
  const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);

  return result;
};

export const userService = {
  getUsers,
  updateUser,
  deleteUser,
};
