import { Express } from "express";
import {
  createCarController,
  deleteCarController,
  getAllCarsController,
  getCarByIdController,
  updateCarController,
} from "./car.controller";

const carRoutes = (app: Express) => {
  // Create a new car
  app.post("/car", async (req, res, next) => {
    try {
      await createCarController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get all cars
  app.get("/car", async (req, res, next) => {
    try {
      await getAllCarsController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Get a car by ID
  app.get("/car/:id", async (req, res, next) => {
    try {
      await getCarByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Update a car by ID
  app.put("/car/:id", async (req, res, next) => {
    try {
      await updateCarController(req, res);
    } catch (error) {
      next(error);
    }
  });

  // Delete a car by ID
  app.delete("/car/:id", async (req, res, next) => {
    try {
      await deleteCarController(req, res);
    } catch (error) {
      next(error);
    }
  });
};

export default carRoutes;