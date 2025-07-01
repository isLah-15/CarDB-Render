
// 

import { Request, Response } from "express";
import {
  createBookingService,
  deleteBookingService,
  getAllBookingService,
  getBookingsById,
  updateBookingService,
} from "./booking.service";

// Create a new booking
export const createBookingController = async (req: Request, res: Response) => {
  try {
    const booking = req.body;

     booking.rentalStartDate = new Date(req.body.rentalStartDate);
     booking.rentalEndDate = new Date(req.body.rentalEndDate);

    console.log(booking)

    const newBooking = await createBookingService(booking);

    console.log(newBooking)
    if (newBooking) {
      return res.status(201).json({ message: "Booking created successfully", data: newBooking });
    } else {
      return res.status(400).json({ message: "Failed to create booking" });
    }
  } catch (error: any) {
    console.error("CREATE BOOKING ERROR:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get all bookings
export const getAllBookingsController = async ( req: Request, res: Response) => {
  try {
    const bookings = await getAllBookingService();

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    return res.status(200).json({ message: "Bookings retrieved successfully", data: bookings });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get booking by ID
export const getAllBookingsByIdController = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.id);

    console.log("uuuuuuuuuuuuu ", req.params.id)
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await getBookingsById(bookingId);

    console.log("23456787654 ", booking)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({data: booking});

  } catch (error: any) {
    return res.status(500).json({error: error.message});
  }
};

// Update booking by ID
export const updateBookingController = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.id);
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = req.body;

     booking.rentalStartDate = new Date(req.body.rentalStartDate);
     booking.rentalEndDate = new Date(req.body.rentalEndDate);


    //Check if the booking exists
    const existingBooking = await getBookingsById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const updatedBooking = await updateBookingService(bookingId, booking);

    if (updatedBooking) {
      return res.status(200).json({ message: "Booking updated successfully", data: updatedBooking });
    } else {
      return res.status(400).json({ message: "Failed to update booking" });
    }
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Delete booking by ID
export const deleteBookingController = async (req: Request, res: Response) => {
  try {
    const bookingId = parseInt(req.params.id);
    if (isNaN(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const existingBooking = await getBookingsById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const deleted = await deleteBookingService(bookingId);
     if (deleted == "Booking not found") {
            res.status(404).json({message: "Booking not found"})
            return;
        }
        return res.status(200).json({ message: "Booking deleted successfully" });
        
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
