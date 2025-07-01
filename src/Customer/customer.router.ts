import { Express } from "express";
import { createCustomerController, deleteCustomerController, getAllCustomersController, getCustomerByIdController, updateCustomerController } from "./customer.controller";
import { adminRoleAuth, bothRoleAuth } from "../Middleware/bearAuth";

const customerRoutes = (app: Express) => {

  // Create a new customer
  app.route('/customer').post(
          async(req, res, next) => {
              try {
                  await createCustomerController(req, res)
              } catch (error) {
                  next(error)
                  
              }
          }
      )
  

  // Get all customers
  app.route('/customer').get(
        //   adminRoleAuth,
          async(req, res, next) => {
              try {
                  await getAllCustomersController(req, res)
              } catch (error) {
                  next(error)
                  
              }
          }
      )

  // Get a customer by ID
app.route('/customer/:id').get(
        // bothRoleAuth,
        async(req, res, next) => {
            try {
                await getCustomerByIdController(req, res)
            } catch (error) {
                next(error)
                
            }
        }
    )

  // Update a customer by ID
  app.route('/customer/:id').put(
        //   bothRoleAuth,
          async(req, res, next) => {
              try {
                  await updateCustomerController(req, res)
              } catch (error) {
                  next(error)
                  
              }
          }
      )

  // Delete a customer by ID
  app.route('/customer/:id').delete(
      async(req, res, next) => {
          try {
              await deleteCustomerController(req, res)
          } catch (error) {
              next(error)

          }
      }
  )

};
  
export default customerRoutes;