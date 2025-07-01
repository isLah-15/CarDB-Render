import { createReservationCarController, deleteReservationController, getAllReservationsController, getReservationByIdController, updateReservationController } from "./reservation.controller";
import { Express } from "express";

const reservationRoutes = (app: Express) => {
  // Create a new reservation
  app.route('/reservation').post(
            async(req, res, next) => {
                try {
                    await createReservationCarController(req, res)
                } catch (error) {
                    next(error)
                    
                }
            }
        )
    

  // Get all reservations
  app.route('/reservation').get(
            async(req, res, next) => {
                try {
                    await getAllReservationsController(req, res)
                } catch (error) {
                    next(error)
                    
                }
            }
        )

  // Get a reservation by ID
  app.route('/reservation/:id').get(
      async(req, res, next) => {
          try {
              await getReservationByIdController(req, res)
          } catch (error) {
              next(error)

          }
      }
  )

  // Update a reservation by ID
  app.route('/reservation/:id').put(
      async(req, res, next) => {
          try {
              await updateReservationController(req, res)
          } catch (error) {
              next(error)
          }
      }
  )

  // Delete a reservation by ID
   app.route('/reservation/:id').delete(
        async(req, res, next) => {
            try {
                await deleteReservationController(req, res)
            } catch (error) {
                next(error)
  
            }
        }
    )

};

export default reservationRoutes;