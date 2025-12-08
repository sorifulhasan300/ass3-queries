import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin", "customer"), bookingController.vehicleBooking);
router.get("/", auth("admin", "customer"), bookingController.getBookings);
router.put(
  "/:bookingId",
  auth("admin", "customer"),
  bookingController.updateBookingStatus
);

export const bookingRouter = router;
