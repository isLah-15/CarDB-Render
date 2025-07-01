import {eq} from "drizzle-orm";
import { BookingTable, CarTable, CustomerTable, PaymentTable, TIBooking } from "../Drizzle/schema";
import db from "../Drizzle/db"; // my configured database connection

//create booking service
export const createBookingService = async (booking: TIBooking) => {
    const inserted = await db.insert(BookingTable).values(booking).returning()
        if(inserted) {
            return inserted;
        }
        return null;
};



// get all bookings service with customer, car, and payment details
export const getAllBookingService = async () => {
  const bookings = await db.query.BookingTable.findMany({
    with: {
      customer: true,
      car: true,
      payments: true,
    },
  });

  if (bookings.length === 0) {
    return "No bookings found";
  }

  return bookings;
};

// get all bookings by Id service with customer, car, and payment details
export const getBookingsById = async (bookingId: number) => {
  const booking = await db.query.BookingTable.findMany({
    where: eq(BookingTable.bookingId, bookingId),
    with: {
      customer: true,
      car: true,
      payments: true,
    },
  });

  if (!booking || booking.length === 0) {
    return "Booking not found";
  }

  return booking;
};




//update booking service
export const updateBookingService = async (id: number, booking: TIBooking) => {
    await db.update(BookingTable).set(booking).where(eq(BookingTable.bookingId, id)).returning();
    return "Booking update successfully";

}

//delete booking service
export const deleteBookingService = async (id: number) => {
    const deleted = await db.delete(BookingTable).where(eq(BookingTable.bookingId, id)).returning();
    if (deleted.length === 0) {
        return "Booking not found";
    }
    return "Booking deleted successfully";
};










