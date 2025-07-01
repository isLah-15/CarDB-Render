import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { ReservationTable, TIReservation } from "../Drizzle/schema";



// create reservation service
export const createReservationService = async (reservation: TIReservation) => {
    const [inserted] = await db.insert(ReservationTable).values(reservation).returning()
        if(inserted) {
            return inserted;
        }
        return null;
};

// Get all reservations 
export const getAllReservationService = async () => {
  const reservations = await db.query.ReservationTable.findMany();

  if (!reservations || reservations.length === 0) {
    return "No reservation found";
  }

  return reservations;
};

// Get reservation by ID
export const getReservationById = async (reservationId: number) => {
  const reservation = await db.query.ReservationTable.findFirst({
    where: eq(ReservationTable.reservationId, reservationId),
  });

  if (!reservation) {
    return "Reservation not found";
  }

  return reservation;
};

//update reservation service
export const updateReservationService = async (id: number, reservation: TIReservation) => {
    await db.update(ReservationTable).set(reservation).where(eq(ReservationTable.reservationId, id)).returning();
    return "Reservation update successfully";

};
//delete reservation service
export const deleteReservationService = async (id: number) => {
    const deleted = await db.delete(ReservationTable).where(eq(ReservationTable.reservationId, id)).returning();
    if (deleted.length === 0) {
        return "Reservation not found";
    }
    return "Reservation deleted successfully";
}