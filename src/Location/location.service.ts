import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { LocationTable, TILocation } from "../Drizzle/schema";

// create location service
export const createLocationService = async (location: TILocation) => {
    const [inserted] = await db.insert(LocationTable).values(location).returning()
        if(inserted) {
            return inserted;
        }
        return null;
};

// Get all locations (future-proofed with optional relations if needed)
export const getAllLocationService = async () => {
  const locations = await db.query.LocationTable.findMany({
    
  });

  if (locations.length === 0) {
    return "No locations found";
  }

  return locations;
};

// Get a location by ID with optional relations
export const getLocationById = async (locationId: number) => {
  const location = await db.query.LocationTable.findFirst({
    where: eq(LocationTable.locationId, locationId),

  });

  if (!location) {
    return "Location not found";
  }

  return location;
};


export const updateLocationService = async (id: number, location: any) => {
  const [updated] = await db
    .update(LocationTable)
    .set(location)
    .where(eq(LocationTable.locationId, id))
    .returning(); // Make sure `.returning()` is used

  return updated || null;
};


//delete location service
export const deleteLocationService = async (id: number) => {
    const deleted = await db.delete(LocationTable).where(eq(LocationTable.locationId, id)).returning();
    if (deleted.length === 0) {
        return "Location not found";
    }
    return "Location deleted successfully";
};


