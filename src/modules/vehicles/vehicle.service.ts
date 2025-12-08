import { pool } from "../../config/database";

const getSingleVehicle = async (id: string) => {
  const result = await pool.query(
    `SELECT id,vehicle_name,type,registration_number,daily_rent_price::FLOAT AS daily_rent_price,availability_status FROM vehicles WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query(
    `SELECT id,vehicle_name,type,registration_number,daily_rent_price::FLOAT AS daily_rent_price,availability_status FROM vehicles`
  );
  return result.rows;
};

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  if (result.rowCount === 0) {
    throw new Error("Vehicle created unsuccessfully");
  }
  const vehicle = result.rows[0];
  return {
    id: vehicle.id,
    vehicle_name: vehicle.vehicle_name,
    type: vehicle.type,
    registration_number: vehicle.registration_number,
    daily_rent_price: Number(vehicle.daily_rent_price),
    availability_status: vehicle.availability_status,
  };
};

const updateVehicle = async (id: string, payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name=$1, type=$2,registration_number=$3,daily_rent_price=$4, availability_status=$5 WHERE id = $6 RETURNING id, vehicle_name,type,registration_number, daily_rent_price::FLOAT AS daily_rent_price,availability_status `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );
  return result;
};


const deleteVehicle = async (id: string) => {
  const res = await pool.query(
    "SELECT COUNT(*) AS count FROM vehicles WHERE id=$1 AND availability_status='booking'",
    [id]
  );
  const activeCount = Number(res.rows[0].count);

  if (res.rowCount === 1) {
    throw new Error(
      "vehicle cannot be deleted because they have active bookings."
    );
  }
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
  if (result.rowCount === 0) {
    throw new Error("Vehicle delete unsuccessfully");
  }
  return result.rows[0];
};

export const vehicleService = {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getSingleVehicle,
  getAllVehicles,
};
