import { Express } from "express";
import { createPaymentController, deletePaymentController, getAllPaymentsController, getPaymentByIdController, updatePaymentController } from "./payment.controller";



const paymentRoutes = (app: Express) => {
  // Create a new payment
  app.route('/payment').post(
            async(req, res, next) => {
                try {
                    await createPaymentController(req, res)
                } catch (error) {
                    next(error)
                    
                }
            }
        )
    

  // Get all payment
  app.route('/payment').get(
            async(req, res, next) => {
                try {
                    await getAllPaymentsController(req, res)
                } catch (error) {
                    next(error)
                    
                }
            }
        )

  // Get a payment by ID
  app.route('/payment/:id').get(
      async(req, res, next) => {
          try {
              await getPaymentByIdController(req, res)
          } catch (error) {
              next(error)

          }
      }
  )

  // Update a payment by ID
   app.route('/payment/:id').put(
            async(req, res, next) => {
                try {
                    await updatePaymentController(req, res)
                } catch (error) {
                    next(error)
                    
                }
            }
        )

  // Delete a payment by ID
  app.route('/payment/:id').delete(
      async(req, res, next) => {
          try {
              await deletePaymentController(req, res)
          } catch (error) {
              next(error)
          }
      }
  )
};

export default paymentRoutes;