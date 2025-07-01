
import { Request, Response } from "express";

import { 
    createCarService,
    deleteCarService,
    getAllCarService,
    getCarById,
    updateCarService
} from "./car.service";

// Create a new car
export const createCarController = async (req: Request, res: Response) => {
    try {
        const car = req.body;

        // Convert the manufacture date to a date object if provided
        if (car.manufactureDate) {
            car.manufactureDate = new Date(car.manufactureDate);
        }
       
        const newCar =  await createCarService(car);
        if (newCar) {
            return res.status(201).json({ message: "Car created successfully", data: newCar });
        } else {
            return res.status(400).json({ message: "Failed to create car" });
        }

    }catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }

};

// Get all cars
export const getAllCarsController = async (req: Request, res: Response) => {
    try {
        const cars = await getAllCarService();
        if (cars.length === 0) {
            return res.status(404).json({ message: "No cars found" });
        }
        return res.status(200).json({ message: "Cars retrieved successfully" ,data:cars });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//Get a car by id
export const getCarByIdController = async (req: Request, res: Response) => {
    try {
        const carId = parseInt(req.params.id);
        if(isNaN(carId)){
        return res.status(400).json({message: "Invalid ID"})
        }

        const car = await getCarById(carId);
        if (!car) {
            return res.status(404).json({message: "Car not found"});
        }

        return res.status(200).json({data: car});

    } catch (error: any) {
        return res.status(500).json({error: error.message});
    };
};

// Update a car by id
export const updateCarController = async (req: Request, res: Response) => {
    try {
        const carId = parseInt(req.params.id);
        if(isNaN(carId)) {
            return res.status(400).json({ message: "Invalid car ID" });
        }

        const car = req.body;

        // Convert the manufacture date to a date object if provided
        if (car.manufactureDate) {
            car.manufactureDate = new Date(car.manufactureDate);
        };

        //Check if the car exists
        const existingCar = await getCarById(carId);
        if (!existingCar) {
            return res.status(404).json({ message: "Car not found" });
        };

        //Check if the car ID is provided in the request body
        // if (!car.carId) {
        //     return res.status(400).json({ message: "Car ID is not provided" });
        // };


        // Update the car
        car.carId = carId; // Ensure the car ID is set for the update


        const updatedCar = await updateCarService(carId, car);
        if (updatedCar) {
            return res.status(200).json({ message: "Car updated successfully", data: updatedCar });
        } else {
            return res.status(400).json({ message: "Failed to update car" });
        }

    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete a car by ID
export const deleteCarController = async (req: Request, res: Response) => {
    try {
        const carId = parseInt(req.params.id);
        if(isNaN(carId)) {
            return res.status(400).json({ message: "Invalid car ID" });
        }

        const existingCar = await getCarById(carId);
        if (!existingCar) {
            return res.status(404).json({ message: "Car not found" });
        };

        const deleted = await deleteCarService(carId);
        if (deleted == "Car not found") {
            res.status(404).json({message: "Car not found"})
            return;
        }
        return res.status(200).json({ message: "Car deleted successfully" });


    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
