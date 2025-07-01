import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { BookingTable, CarTable, InsuranceTable, MaintenanceTable, ReservationTable, TICar } from "../Drizzle/schema";


// create car service
export const createCarService = async (car: TICar) => {
    const [inserted] = await db.insert(CarTable).values(car).returning()
        if(inserted) {
            return inserted;
        }
        return null;
};

//get all car service with reservations, bookings, maintenance, and insurance details
export const getAllCarService = async () => {
  const cars = await db.query.CarTable.findMany({
    with: {
      reservations: true,
      bookings: true,
      maintenance: true,
      insurance: true,
    }
  });

  if (cars.length === 0) {
    return "No cars found";
  }
  return cars;
};

//get car by id with reservations, bookings, maintenance, and insurance details
export const getCarById = async (carId: number) => {
  const car = await db.query.CarTable.findFirst({
    where: eq(CarTable.carId, carId),
    with: {
      reservations: true,
      bookings: true,
      maintenance: true,
      insurance: true,
    },
  });

  if (!car) {
    return "Car not found";
  }

  return car;
};

//update car service
export const updateCarService = async (id: number, car: TICar) => {
    await db.update(CarTable).set(car).where(eq(CarTable.carId, id)).returning();
    return "Car update successfully";

};

//delete car service
export const deleteCarService = async (id: number) => {
    const deleted = await db.delete(CarTable).where(eq(CarTable.carId, id)).returning();
    if (deleted.length === 0) {
        return "Car not found";
    }
    return "Car deleted successfully";
};

