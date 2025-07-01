import { Request, Response } from "express";
import { createReservationService, deleteReservationService, getAllReservationService, getReservationById, updateReservationService } from "./reservation.service";

// Create a reservation
export const createReservationCarController = async (req: Request, res: Response) => {
    try {
        const reservation = req.body;

        // Ensure the correct field names and convert to Date
        if (reservation.reservationDate) {
            reservation.reservationDate = new Date(reservation.reservationDate);
        }
        if (reservation.pickupDate) {
            reservation.pickupDate = new Date(reservation.pickupDate);
        }
        if (reservation.returnDate) {
            reservation.returnDate = new Date(reservation.returnDate);
        }

        // Check that pickupDate is before returnDate
        if (reservation.pickupDate && reservation.returnDate) {
            if (reservation.pickupDate >= reservation.returnDate) {
                return res.status(400).json({ message: "Pickup date must be before return date" });
            }
        }

        const newReservation = await createReservationService(reservation);

        if (newReservation) {
            return res.status(201).json({ message: "Reservation created successfully", data: newReservation });
        } else {
            return res.status(400).json({ message: "Failed to create reservation" });
        }
    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// Get all reservations
export const getAllReservationsController = async (req: Request, res: Response) => {
    try {
        const reservations = await getAllReservationService();
        if (reservations.length === 0) {
            return res.status(404).json({ message: "No reservations found" });
        }
        return res.status(200).json({ message: "Reservations retrieved successfully", data: reservations });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//Get a reservation by id
export const getReservationByIdController = async (req: Request, res: Response) => {
    try {
        const reservationId = parseInt(req.params.id);
        if(isNaN(reservationId)){
        return res.status(400).json({message: "Invalid ID"})
        }

        const reservation = await getReservationById(reservationId);
        if (!reservation) {
            return res.status(404).json({message: "Reservation not found"});
        }

        return res.status(200).json({data: reservation});

    } catch (error: any) {
        return res.status(500).json({error: error.message});
    };
};

// Update a reservation by id
export const updateReservationController = async (req: Request, res: Response) => {
    try {
        const reservationId = parseInt(req.params.id);
        if(isNaN(reservationId)) {
            return res.status(400).json({ message: "Invalid reservation ID" });
        }

        const reservation = req.body;

        // Convert the reservation date to a date object if provided
        if (reservation.reservationDate) {
            reservation.reservationDate = new Date(reservation.reservationDate);
        };

        // //Check if the reservation exists
        // const existingReservation = await getReservationById(reservationId);
        // if (!existingReservation) {
        //     return res.status(404).json({ message: "Reservation not found" });
        // };

        //Check if the reservation ID is provided in the request body
        if (!reservation.reservationId) {
            return res.status(400).json({ message: "Reservation ID is required" });
        };

        //check if the reservation ID in the request body matches the reservation ID in the URL
        if (reservation.reservationId !== reservationId) {
            return res.status(400).json({ message: "Reservation ID in request body does not match URL" });
        };

        // Check if the reservation pickup and return dates are valid
        if (reservation.pickupDate) {
            reservation.pickupDate = new Date(reservation.pickupDate);
        }
        if (reservation.returnDate) {
            reservation.returnDate = new Date(reservation.returnDate);
        }
        if (reservation.pickupDate && reservation.returnDate) {
            if (reservation.pickupDate >= reservation.returnDate) {
                return res.status(400).json({ message: "Invalid reservation dates" });
            }
        }

        // Convert the reservation pickup and return dates to date objects if provided
        if (reservation.pickupDate) {
            reservation.pickupDate = new Date(reservation.pickupDate);
        }
        if (reservation.returnDate) {
            reservation.returnDate = new Date(reservation.returnDate);
        }
        
        // Update the reservation
        reservation.reservationId = reservationId; // Ensure the reservation ID is set for the update


        const updatedReservation = await updateReservationService(reservationId, reservation);
        if (updatedReservation) {
            return res.status(200).json({ message: "Reservation updated successfully", data: updatedReservation });
        } else {
            return res.status(400).json({ message: "Failed to update reservation" });
        }

    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete a reservation by id
export const deleteReservationController = async (req: Request, res: Response) => {
    try {
        const reservationId = parseInt(req.params.id);
        if(isNaN(reservationId)) {
            return res.status(400).json({ message: "Invalid reservation ID" });
        }

        const existingReservation = await getReservationById(reservationId);
        if (!existingReservation) {
            return res.status(404).json({ message: "Reservation not found" });
        };

        const deleted = await deleteReservationService(reservationId);
        if (!deleted) {
            return res.status(404).json({message: "Reservation not found"})
        } res.sendStatus(204).json({ message: "Reservation deleted successfully" });

    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};