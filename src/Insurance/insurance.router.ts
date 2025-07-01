import { Express } from "express";
import { createInsuranceController, deleteInsuranceController, getAllInsurancesController, getInsuranceByIdController, updateInsuranceController } from "./insurance.controller";
import { adminRoleAuth } from "../Middleware/bearAuth";

const insuranceRoutes = (app: Express) => {

  // Create a new insurance
   app.route('/insurance').post(
            async(req, res, next) => {
                try {
                    await createInsuranceController(req, res)
                } catch (error) {
                    next(error)
                    
                }
            }
        )
    

  // Get all insurances
  app.route('/insurance').get(
            // adminRoleAuth,
            async(req, res, next) => {
                try {
                    await getAllInsurancesController(req, res)
                } catch (error) {
                    next(error)
                    
                }
            }
        )

  // Get a insurance by ID
  app.route('/insurance/:id').get(
          async(req, res, next) => {
              try {
                  await getInsuranceByIdController(req, res)
              } catch (error) {
                  next(error)

              }
          }
      )

  // Update a insurance by ID
  app.route('/insurance/:id').put(
          async(req, res, next) => {
              try {
                  await updateInsuranceController(req, res)
              } catch (error) {
                  next(error)

              }
          }
      )

  // Delete a insurance by ID
  app.route('/insurance/:id').delete(
        async(req, res, next) => {
            try {
                await deleteInsuranceController(req, res)
            } catch (error) {
                next(error)
  
            }
        }
    )
};

export default insuranceRoutes;