import { Express } from "express";
import { createLocationController, deleteLocationController, getAllLocationsController, getLocationByIdController, updateLocationController } from "./location.controller";


const locationRoutes = (app: Express) => {

  // Create a new location
  app.route('/location').post(
            async(req, res, next) => {
                try {
                    await createLocationController(req, res)
                } catch (error) {
                    next(error)
                    
                }
            }
        )

  // Get all location
  app.route('/location').get(
      async(req, res, next) => {
          try {
              await getAllLocationsController(req, res)
          } catch (error) {
              next(error)

          }
      }
  )

  // Get a location by ID
  app.route('/location/:id').get(
          async(req, res, next) => {
              try {
                  await getLocationByIdController(req, res)
              } catch (error) {
                  next(error)
                  
              }
          }
      )

  // Update a location by ID
  app.route('/location/:id').put(
      async(req, res, next) => {
          try {
              await updateLocationController(req, res)
          } catch (error) {
              next(error)
          }
      }
  )

  // Delete a location by ID
  app.route('/location/:id').delete(
      async(req, res, next) => {
          try {
              await deleteLocationController(req, res)
          } catch (error) {
              next(error)
          }
      }
  )

  // Delete a location by ID
  app.route('/location/:id').delete(
      async(req, res, next) => {
          try {
              await deleteLocationController(req, res)
          } catch (error) {
              next(error)
          }
      }
  )

  
};

export default locationRoutes;