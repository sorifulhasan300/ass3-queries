import { pool } from "../../config/database";

const vehicleBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);
  if (startDate > endDate) {
    throw new Error("Rent end date must be after start date.");
  }
  const result = await pool.query(
    "INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date) VALUES($1,$2,$3,$4) RETURNING *",
    [customer_id, vehicle_id, rent_start_date, rent_end_date]
  );
  if (result.rowCount === 0) {
    throw new Error("Some think was wrong");
  }
  const bookingId = result.rows[0].id;
  const bookingWithVehicle = await pool.query(
    `SELECT b.*,vehicle_name AS vehicle_name,
     v.daily_rent_price,
     v.availability_status 
     FROM bookings b
     JOIN vehicles v ON b.vehicle_id = v.id
     WHERE b.id = $1;
`,
    [bookingId]
  );
  const booking = bookingWithVehicle.rows[0];
  if (booking.availability_status === "booked") {
    throw new Error("This vehicle already booked");
  }
  await pool.query(
    `UPDATE vehicles
     SET availability_status = 'booked'
     WHERE id = $1`,
    [vehicle_id]
  );

  const duration_days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const total_price = booking.daily_rent_price * duration_days;

  return {
    id: booking.id,
    customer_id: booking.customer_id,
    vehicle_id: booking.vehicle_id,
    rent_start_date: booking.rent_start_date,
    rent_end_date: booking.rent_end_date,
    total_price: total_price,
    status: booking.status,
    vehicle: {
      vehicle_name: booking.vehicle_name,
      daily_rent_price: Number(booking.daily_rent_price),
    },
  };
};

const getBookings = async (role: string, customerId: number) => {
  if (role === "customer") {
    const result = await pool.query(
      `SELECT 
        b.id AS booking_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.status,
        v.vehicle_name,
        v.registration_number,
        v.type,
        v.daily_rent_price
     FROM bookings b
     JOIN vehicles v ON b.vehicle_id = v.id
     WHERE b.customer_id = $1
     ORDER BY b.id DESC`,
      [customerId]
    );

    const rows = result.rows;

    const formattedBookings = rows.map((row) => {
      const start = new Date(row.rent_start_date);
      const end = new Date(row.rent_end_date);

      const diffMs = end.getTime() - start.getTime();
      const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      const totalPrice = totalDays * Number(row.daily_rent_price);

      return {
        id: row.booking_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        status: row.status,
        total_price: totalPrice,
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
          type: row.type,
        },
      };
    });

    return formattedBookings;
  }

  if (role === "admin") {
    const result = await pool.query(
      `SELECT 
        b.id AS booking_id,
        b.customer_id,
        b.vehicle_id,
        b.rent_start_date,
        b.rent_end_date,
        b.status,

        u.name AS customer_name,
        u.email AS customer_email,

        v.vehicle_name,
        v.registration_number,
        v.type,
        v.daily_rent_price

     FROM bookings b
     JOIN users u ON b.customer_id = u.id
     JOIN vehicles v ON b.vehicle_id = v.id
     ORDER BY b.id DESC`
    );

    const bookings = result.rows;

    const formattedAdminData = bookings.map((row) => {
      const start = new Date(row.rent_start_date);
      const end = new Date(row.rent_end_date);

      const diffTime = end.getTime() - start.getTime();
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const totalPrice = totalDays * Number(row.daily_rent_price);

      return {
        id: row.booking_id,
        customerId: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        status: row.status,
        total_price: totalPrice,

        customer: {
          name: row.customer_name,
          email: row.customer_email,
        },

        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
          type: row.type,
          daily_rent_price: row.daily_rent_price,
        },
      };
    });

    return formattedAdminData;
  }
};

const updateBookingStatus = async (
  id: string,
  status: string,
  role: string
) => {
  const result = await pool.query(
    `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );

  if (result.rowCount === 0) {
    throw new Error("Booking Not Found");
  }
  const bookings = result.rows[0];
  const startDate = bookings.rent_end_date;
  const endDate = bookings.rows[0].rent_end_date;
  const duration_days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = duration_days * 100;
  const today = new Date();

  if (role === "customer") {
    if (today < startDate) {
      // ekhane query chalabo cencel korbe vechele booking status canceled
    } else {
      throw new Error("You do not canceled booking");
    }
  }

  if (role === "admin") {
    // Admin: Mark as "returned" (updates vehicle to "available")
  }

  if (endDate === today) {
    // System: Auto-mark as "returned" when period ends
  }

  return {
    id: bookings.id,
    customer_id: bookings.customer_id,
    vehicle_id: bookings.vehicle_id,
    rent_start_date: bookings.rent_start_date,
    rent_end_date: bookings.rent_end_date,
    total_price: totalPrice,
    status: bookings.status,
    vehicle: {
      availability_status: bookings.availability_status,
    },
  };
};

// const cancelBooking = async (id: string, customer_id: string) => {
//   const booking = await pool.query(
//     SELECT * FROM bookings WHERE id=$1 AND customer_id=$2,
//     [id, customer_id]
//   );

//   if (booking.rows.length === 0) {
//     return "Booking not found or unauthorized";
//   }

//   const start = new Date(booking.rows[0].rent_start_date);
//   const today = new Date();

//   if (today >= start) {
//     return "Booking can't be cancelled after start date";
//   }

//   await pool.query(UPDATE bookings SET status='cancelled' WHERE id=$1, [id]);

//   await pool.query(
//     UPDATE vehicles SET availability_status='available' WHERE id=$1,
//     [booking.rows[0].vehicle_id]
//   );

//   return booking.rows[0];
// };

// const makeReturned = async (id: string) => {
//   const booking = await pool.query(SELECT * FROM bookings WHERE id=$1, [id]);

//   if (booking.rows.length === 0) {
//     return "Booking not found";
//   }

//   await pool.query(UPDATE bookings SET status='returned' WHERE id=$1, [id]);

//   await pool.query(
//     UPDATE vehicles SET availability_status='available' WHERE id=$1,
//     [booking.rows[0].vehicle_id]
//   );

//   return booking.rows[0];
// };

// const autoReturned = async () => {
//   const toDay = new Date();

//   const result = await pool.query(
//     SELECT * FROM bookings WHERE rent_end_date<$1 AND status='active',
//     [toDay]
//   );

//   for (let booking of result.rows) {
//     await pool.query(UPDATE bookings SET status='returned' WHERE id=$1, [
//       booking.id,
//     ]);

//     await pool.query(
//       UPDATE vehicles SET availability_status='available' WHERE id=$1,
//       [booking.vehicle_id]
//     );
//   }

//   return result.rows.length;
// };

export const bookingService = {
  vehicleBooking,
  getBookings,
  updateBookingStatus,
};
