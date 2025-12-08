import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const vehicleBooking = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.vehicleBooking(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: "Booking created unsuccessfully",
      error: (error as Error).message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    const customerId = req.user?.id;
    const booking = await bookingService.getBookings(role, customerId);

    res.status(200).json({
      success: true,
      message: "Get Bookings successfully",
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Get Bookings unsuccessfully",
      error: (error as Error).message,
    });
  }
};

const updateBookingStatus = async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const customerId = req.user?.id;
  const status = req.body.status;
  const role = req.user?.role;
  try {
    const booking = await bookingService.updateBookingStatus(
      bookingId as string,
      customerId,
      status,
      role
    );

    res.status(201).json({
      success: true,
      message: "update booking status successfully",
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "update Booking status unsuccessfully",
      error: (error as Error).message,
    });
  }
};

export const bookingController = {
  vehicleBooking,
  getBookings,
  updateBookingStatus,
};
