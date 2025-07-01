import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { CarTable, InsuranceTable, TIInsurance } from "../Drizzle/schema";

// create a new insurance service
export const createInsuranceService = async (insurance: TIInsurance) => {
    const [inserted] = await db.insert(InsuranceTable).values(insurance).returning()
        if(inserted) {
            return inserted;
        }
        return null;
};

// get all insurance service with car details
export const getAllInsuranceService = async () => {
  const insurances = await db.query.InsuranceTable.findMany({
    with: {
      car: true,
    },
  });

  if (insurances.length === 0) {
    return "No insurance found";
  }

  return insurances;
};

// get insurance by id with car details
export const getInsuranceById = async (insuranceId: number) => {
  const insurance = await db.query.InsuranceTable.findFirst({
    where: eq(InsuranceTable.insuranceId, insuranceId),
    with: {
      car: true,
    },
  });

  if (!insurance) {
    return "Insurance not found";
  }

  return insurance;
};

export const updateInsuranceService = async (
  id: number,
  insurance: Partial<TIInsurance>
) => {
  const [updated] = await db
    .update(InsuranceTable)
    .set(insurance)
    .where(eq(InsuranceTable.insuranceId, id))
    .returning();

  return updated || null;
};




export const deleteInsuranceService = async (insuranceId: number) => {
  const deleted = await db
    .delete(InsuranceTable)
    .where(eq(InsuranceTable.insuranceId, insuranceId))
    .returning(); 

  if (deleted.length > 0) {
    return "Insurance deleted successfully";
  } else {
    return "Insurance not found";
  }
};


