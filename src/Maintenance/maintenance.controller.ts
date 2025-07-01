import { Request, Response } from "express";
import { createMaintenanceService, deleteMaintenanceService, getAllMaintenanceService, getMaintenanceById, updateMaintenanceService } from "./maintenance.service";

// Create a new maintenance row
export const createMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenance = req.body;

        // Convert the maintenance date to a date object if provided
        if (maintenance.maintenanceDate) {
            maintenance.maintenanceDate = new Date(maintenance.maintenanceDate);
        }
        

        const newMaintenance =  await createMaintenanceService(maintenance);
        if (newMaintenance) {
            return res.status(201).json({ message: "Maintenance created successfully", data: newMaintenance });
        } else {
            return res.status(400).json({ message: "Failed to create maintenance" });
        }

    }catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }

};

// Get all maintenance records
export const getAllMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenance = await getAllMaintenanceService();
        if (maintenance.length === 0) {
            return res.status(404).json({ message: "No maintenance found" });
        }
        return res.status(200).json({ message: "Maintenance retrieved successfully", data: maintenance });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//Get a maintenance record by id
export const getMaintenanceByIdController = async (req: Request, res: Response) => {
    try {
        const maintenanceId = parseInt(req.params.id);
        if(isNaN(maintenanceId)){
        return res.status(400).json({message: "Invalid ID"})
        }

        const maintenance = await getMaintenanceById(maintenanceId);
        if (!maintenance) {
            return res.status(404).json({message: "Maintenance not found"});
        }

        return res.status(200).json({data: maintenance});

    } catch (error: any) {
        return res.status(500).json({error: error.message});
    };
};

// Update a maintenance by id
export const updateMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenanceId = parseInt(req.params.id);
        if(isNaN(maintenanceId)) {
            return res.status(400).json({ message: "Invalid maintenance ID" });
        }

        const maintenance = req.body;

        // Convert the service date to a date object if provided
        if (maintenance.maintenanceDate) {
            maintenance.maintenanceDate = new Date(maintenance.maintenanceDate);
        };

        //Check if the maintenance exists
        const existingMaintenance = await getMaintenanceById(maintenanceId);
        if (!existingMaintenance) {
            return res.status(404).json({ message: "Maintenance not found" });
        };

        //Check if the maintenance ID is provided in the request body
        if (!maintenance.maintenanceId) {
            return res.status(400).json({ message: "Maintenance ID is required" });
        };

        //check if the maintenance ID in the request body matches the maintenance ID in the URL
        if (maintenance.maintenanceId !== maintenanceId) {
            return res.status(400).json({ message: "Maintenance ID in request body does not match URL" });
        };

        // Update the car
        maintenance.maintenanceId = maintenanceId; 


        const updatedMaintenance = await updateMaintenanceService(maintenanceId, maintenance);
        if (updatedMaintenance) {
            return res.status(200).json({ message: "Maintenance updated successfully", data: updatedMaintenance });
        } else {
            return res.status(400).json({ message: "Failed to update maintenance" });
        }

    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete a maintenance by id
export const deleteMaintenanceController = async (req: Request, res: Response) => {
    try {
        const maintenanceId = parseInt(req.params.id);
        if(isNaN(maintenanceId)) {
            return res.status(400).json({ message: "Invalid maintenance ID" });
        }

        const existingMaintenance = await getMaintenanceById(maintenanceId);
        if (!existingMaintenance) {
            return res.status(404).json({ message: "Maintenance not found" });
        };

        const deleted = await deleteMaintenanceService(maintenanceId);
        if (!deleted) {
            return res.status(404).json({message: "Maintenance not found"})
        } res.sendStatus(204).json({ message: "Maintenance deleted successfully" });

    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};