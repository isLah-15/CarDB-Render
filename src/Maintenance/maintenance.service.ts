import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { CarTable, MaintenanceTable, TIMaintenance } from "../Drizzle/schema";

// create maintenance service
export const createMaintenanceService = async (maintenance: TIMaintenance) => {
    const [inserted] = await db.insert(MaintenanceTable).values(maintenance).returning()
        if(inserted) {
            return inserted;
        }
        return null;
};

// Get all maintenance records with car details
export const getAllMaintenanceService = async () => {
  const maintenance = await db.query.MaintenanceTable.findMany({
    with: {
      car: true,
    },
  });

  if (!maintenance || maintenance.length === 0) {
    return "No maintenance found";
  }

  return maintenance;
};

// Get maintenance by ID with car details
export const getMaintenanceById = async (maintenanceId: number) => {
  const maintenance = await db.query.MaintenanceTable.findMany({
    
    with: {
      car: true,
    },
  });

  if (!maintenance) {
    return "Maintenance not found";
  }

  return maintenance;
};

// Update maintenance by ID 
export const updateMaintenanceService = async (id: number, maintenance: any) => {
  const [updated] = await db
    .update(MaintenanceTable)
    .set(maintenance)
    .where(eq(MaintenanceTable.maintenanceId, id))
    .returning(); // Make sure `.returning()` is used

  return updated || null;
};


//delete maintenance service
export const deleteMaintenanceService = async (id: number) => {
    const deleted = await db.delete(MaintenanceTable).where(eq(MaintenanceTable.maintenanceId, id)).returning();
    if (deleted.length === 0) {
        return "Maintenance not found";
    }
    return "Maintenance deleted successfully";
};