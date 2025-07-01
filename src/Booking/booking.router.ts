
import { adminRoleAuth, bothRoleAuth } from "../Middleware/bearAuth";
import { createBookingController, deleteBookingController, getAllBookingsByIdController, getAllBookingsController, updateBookingController } from "./booking.controller";
import { Express } from "express";

const booking = (app:Express) => {
    app.route('/booking').post(
        async(req, res, next) => {
            try {
                await createBookingController(req, res)
            } catch (error) {
                next(error)
                
            }
        }
    )


    // get all bookings
    app.route('/booking').get(
        // adminRoleAuth,
        async (req, res, next) => {
            try {
                await getAllBookingsController(req, res)
            } catch (error) {
                next(error)
                
            }
        }
    )

    // get booking by id
    app.route('/booking/:id').get(
        // bothRoleAuth,
        async(req, res, next) => {
            try {
                await getAllBookingsByIdController(req, res)
            } catch (error) {
                next(error)
                
            }
        }
    )




    // update booking by id
    app.route('/booking/:id').put(
        // bothRoleAuth,
        async(req, res, next) => {
            try {
                await updateBookingController(req, res)
            } catch (error) {
                next(error)
                
            }
        }
    )

    // delete booking by id
    app.route('/booking/:id').delete(
        // bothRoleAuth,
        async(req, res, next) => {
            try {
                await deleteBookingController(req, res)
            } catch (error) {
                next(error)
                
            }
        }
    )
}

export default booking