--Query 1

select
  booking_id,
  user_name as "customer_name",
  vehicle_name as "vehicle_name",
  start_date,
  end_date,
  status
  
from
  bookings as b
  inner join users as u on b.user_id = u.user_id
  inner join vehicles as v on b.vehicle_id = v.vehicle_id;

--Query 2 find all vehicles never bin booked

select *
from vehicles 
where not exists (
  select booking_id
  from bookings 
  where bookings.vehicle_id = vehicles.vehicle_id
);


-- Query 3 Requirement: Retrieve all available vehicles of a specific type (e.g. cars)

select * from vehicles where availability = 'available' and type = 'car';



-- Query 4 Find the total number of bookings for each vehicle and display only those vehicles that have more than 2 bookings
select
  vehicle_name,
  count(booking_id) as "total_bookings"
from
  bookings
  join vehicles on bookings.vehicle_id = vehicles.vehicle_id
group by
  vehicle_name
having
  count(booking_id) > 2;

