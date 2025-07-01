import { Express } from "express";
import { createMaintenanceController, deleteMaintenanceController, getAllMaintenanceController, getMaintenanceByIdController, updateMaintenanceController } from "./maintenance.controller";

const maintenanceRoutes = (app: Express) => {

  // Create a new maintenance
  app.route('/maintenance').post(
            async(req, res, next) => {
                try {
                    await createMaintenanceController(req, res)
                } catch (error) {
                    next(error)
                    
                }
            }
        )
    

  // Get all maintenance records
  app.route('/maintenance').get(
      async(req, res, next) => {
    try {
      await getAllMaintenanceController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get a maintenance by ID
  app.route('/maintenance/:id').get(
      async(req, res, next) => {
    try {
      await getMaintenanceByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update a maintenance by ID
  app.route('/maintenance/:id').put(
      async(req, res, next) => {
    try {
      await updateMaintenanceController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete a maintenance by ID
  app.route('/maintenance/:id').delete(
      async(req, res, next) => {
    try {
      await deleteMaintenanceController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default maintenanceRoutes;