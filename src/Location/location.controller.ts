import { Request, Response } from "express";

import { createLocationService, deleteLocationService, getAllLocationService, getLocationById, updateLocationService } from "./location.service";


// Create a new location
export const createLocationController = async (req: Request, res: Response) => {
    try {
        const location = req.body;

        const newLocation =  await createLocationService(location);
        if (newLocation) {
            return res.status(201).json({ message: "New location created successfully", data: newLocation });
        } else {
            return res.status(400).json({ message: "Failed to create location" });
        }

    }catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }

};

// Get all locations
export const getAllLocationsController = async (req: Request, res: Response) => {
    try {
        const location = await getAllLocationService();
        if (location.length === 0) {
            return res.status(404).json({ message: "No locations found" });
        }
        return res.status(200).json({ message: "Locations retrieved successfully", data: location });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//Get a location by id
export const getLocationByIdController = async (req: Request, res: Response) => {
    try {
        const locationId = parseInt(req.params.id);
        if(isNaN(locationId)){
        return res.status(400).json({message: "Invalid ID"})
        }

        const location = await getLocationById(locationId);
        if (!location) {
            return res.status(404).json({message: "Location not found"});
        }

        return res.status(200).json({data: location});

    } catch (error: any) {
        return res.status(500).json({error: error.message});
    };
};

// Update a location by id
export const updateLocationController = async (req: Request, res: Response) => {
    try {
        const locationId = parseInt(req.params.id);
        if(isNaN(locationId)) {
            return res.status(400).json({ message: "Invalid location ID" });
        }

        const location = req.body;

        //Check if the location exists
        const existingLocation = await getLocationById(locationId);
        if (!existingLocation) {
            return res.status(404).json({ message: "Location not found" });
        };

        //Check if the location ID is provided in the request body
        if (!location.locationId) {
            return res.status(400).json({ message: "Location ID is required" });
        };

        //check if the location ID in the request body matches the location ID in the URL
        if (location.locationId !== locationId) {
            return res.status(400).json({ message: "Location ID in request body does not match URL" });
        };

        // Update the location
        location.locationId = locationId; // Ensure the location ID is set for the update


        const updatedLocation = await updateLocationService(locationId, location);
        if (updatedLocation) {
            return res.status(200).json({ message: "Location updated successfully", data: updatedLocation });
        } else {
            return res.status(400).json({ message: "Failed to update location" });
        }

    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const deleteLocationController = async (req: Request, res: Response) => {
  try {
    const locationId = parseInt(req.params.id);
    if (isNaN(locationId)) {
      return res.status(400).json({ message: "Invalid location ID" });
    }

    const existingLocation = await getLocationById(locationId);
    if (!existingLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    const deleted = await deleteLocationService(locationId);
    if (!deleted) {
      return res.status(404).json({ message: "Location not found" });
    }

    return res.sendStatus(204); // ✅ Correct usage

  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
