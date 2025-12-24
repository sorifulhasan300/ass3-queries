<h1>🚗 Vehicle Rental System – SQL Queries Documentation</h1>

<hr />

<h2>📌 Project Overview</h2>
<p>
This project demonstrates core <strong>SQL querying concepts</strong> using a
<strong>Vehicle Rental System</strong> database.
The schema is designed around three main entities:
</p>

<ul>
  <li><strong>Users</strong> (Customers)</li>
  <li><strong>Vehicles</strong></li>
  <li><strong>Bookings</strong></li>
</ul>

<p>
The goal of this project is to retrieve meaningful information from the database
using standard SQL techniques such as
<strong>JOIN</strong>, <strong>WHERE</strong>, <strong>NOT EXISTS</strong>,
<strong>GROUP BY</strong>, and <strong>HAVING</strong>.
</p>

<hr />

<h2>🗂️ Database Tables Used</h2>

<h3>👤 users</h3>
<ul>
  <li><code>user_id</code> (Primary Key)</li>
  <li><code>user_name</code></li>
  <li><code>email</code></li>
  <li><code>phone</code></li>
  <li><code>role</code></li>
</ul>

<h3>🚘 vehicles</h3>
<ul>
  <li><code>vehicle_id</code> (Primary Key)</li>
  <li><code>vehicle_name</code></li>
  <li><code>type</code></li>
  <li><code>availability_status</code></li>
</ul>

<h3>📅 bookings</h3>
<ul>
  <li><code>booking_id</code> (Primary Key)</li>
  <li><code>user_id</code> (Foreign Key → users)</li>
  <li><code>vehicle_id</code> (Foreign Key → vehicles)</li>
  <li><code>start_date</code></li>
  <li><code>end_date</code></li>
  <li><code>status</code></li>
</ul>

<hr />

<h2>📁 Project Structure</h2>

<pre>
├── README.md
├── queries.sql
└── QUERY.md   (Sample Input / Output reference)
</pre>

<hr />

<h2>🧠 SQL Queries Explanation</h2>

<h3>✅ Query 1: Booking Information with Customer & Vehicle Name</h3>
<p><strong>Concepts Used:</strong> INNER JOIN</p>

<p>
This query retrieves booking information along with the customer name and vehicle name.
</p>

<pre>
SELECT
  booking_id,
  user_name AS "customer_name",
  vehicle_name AS "vehicle_name",
  start_date,
  end_date,
  status
FROM
  bookings
INNER JOIN users ON bookings.user_id = users.user_id
INNER JOIN vehicles ON bookings.vehicle_id = vehicles.vehicle_id;
</pre>

<hr />

<h3>✅ Query 2: Vehicles That Have Never Been Booked</h3>
<p><strong>Concepts Used:</strong> NOT EXISTS</p>

<p>
This query finds all vehicles that do not have any booking records.
</p>

<pre>
SELECT
  *
FROM
  vehicles
WHERE
  NOT EXISTS (
    SELECT
      booking_id
    FROM
      bookings
    WHERE
      bookings.vehicle_id = vehicles.vehicle_id
  )
ORDER BY
  vehicle_id ASC;
</pre>

<hr />

<h3>✅ Query 3: Available Vehicles of a Specific Type</h3>
<p><strong>Concepts Used:</strong> SELECT, WHERE</p>

<p>
This query retrieves all available vehicles filtered by a specific type
(example: bike).
</p>

<pre>
SELECT
  *
FROM
  vehicles
WHERE
  availability_status = 'available'
  AND type = 'bike';
</pre>

<hr />

<h3>✅ Query 4: Vehicles with More Than 2 Bookings</h3>
<p><strong>Concepts Used:</strong> GROUP BY, HAVING, COUNT</p>

<p>
This query calculates the total number of bookings per vehicle and
displays only those with more than two bookings.
</p>

<pre>
SELECT
  vehicle_name,
  COUNT(booking_id) AS "total_bookings"
FROM
  bookings
JOIN vehicles ON bookings.vehicle_id = vehicles.vehicle_id
GROUP BY
  vehicle_name
HAVING
  COUNT(booking_id) > 2;
</pre>

<hr />

<h2>🎯 Key SQL Concepts Demonstrated</h2>
<ul>
  <li>Relational joins</li>
  <li>Subqueries with EXISTS / NOT EXISTS</li>
  <li>Conditional filtering</li>
  <li>Data aggregation</li>
  <li>GROUP BY and HAVING clauses</li>
</ul>

<hr />

<h2>🚀 Final Notes</h2>
<p>
This project follows traditional relational database design principles and
demonstrates real-world SQL usage.
It is suitable for academic submission, practice, and interview preparation.
</p>

<p><strong>Clean SQL. Strong fundamentals. Future-ready skills.</strong></p>
