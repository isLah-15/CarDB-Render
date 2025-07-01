import {CarTable} from "../../src/Drizzle/schema";
import {createCarService, deleteCarService, getAllCarService, getCarById, updateCarService} from "../../src/Car/car.service";

import db from "../../src/Drizzle/db";

jest.mock("../../src/Drizzle/db", () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    select: jest.fn(),
    query: {
        CarTable: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
        }
    }

}));

// const mockLeftJoin = jest.fn().mockReturnThis()

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Car Service Tests", () => {
    describe("create a car", () => {
        it("should create a car successfully", async () => {
            const mockCar = {
                    carModel: "Camry",
                    manufacturer: "Toyota",
                    year: 2020,
                    color: "Blue",
                    rentalRate: 100,
                    availability: true
            };

           const insertedCar = { carId: 1, ...mockCar };
           //chaining
           (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockReturnValueOnce([insertedCar])
                })
            });

              const result = await createCarService(mockCar);
              expect(db.insert).toHaveBeenCalledWith(CarTable);
                expect(result).toEqual(insertedCar);
        });
    })

    describe("get a car", () => {
        it("should return all cars", async () => {
          const mockCars = [
            {
              carId: 1,
              carModel: "Camry",
              manufacturer: "Toyota",
              year: 2020,
              color: "Blue",
              rentalRate: 100,
              availability: true,
              reservations: [],
              bookings: [],
              maintenance: [],
              insurance: [],
            },

            {
              carId: 2,
              carModel: "Civic",
              manufacturer: "Honda",
              year: 2019,
              color: "Red",
              rentalRate: 90,
              availability: true,
              reservations: [],
              bookings: [],
              maintenance: [],
              insurance: [],
        },
    ];

        (db.query.CarTable.findMany as jest.Mock).mockResolvedValueOnce(mockCars);
            const result = await getAllCarService();
            expect(result).toEqual(mockCars);
        });


        it("should return 'No cars found' if no cars exist", async () => {
            (db.query.CarTable.findMany as jest.Mock).mockResolvedValueOnce([]);
            const result = await getAllCarService();
            expect(result).toEqual("No cars found");
        });
    });

    describe("get a car by ID", () => {
  it("should return a car by ID with related details", async () => {
    const mockCar = {
      carId: 1,
      carModel: "Camry",
      manufacturer: "Toyota",
      year: 2020,
      color: "Blue",
      rentalRate: 100,
      availability: true,
      reservations: [{ reservationId: 101 }],
      bookings: [{ bookingId: 201 }],
      maintenance: [{ maintenanceId: 301 }],
      insurance: [{ insuranceId: 401 }],
    };

    (db.query.CarTable.findFirst as jest.Mock).mockResolvedValueOnce(mockCar);

    const result = await getCarById(1);
    expect(db.query.CarTable.findFirst).toHaveBeenCalled();
    expect(result).toEqual(mockCar);
  });


  it("should return 'Car not found' if ID does not match", async () => {
    (db.query.CarTable.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const result = await getCarById(999);
    expect(result).toEqual("Car not found");
  });
});


    describe("update car", () => {
        it("should update a car and return a success message", async () => {
            const updatedCarData = {
            carModel: "Accord",
            manufacturer: "Honda",
            year: 2021,
            color: "Black",
            rentalRate: 120,
            availability: true,
    };
    // Mock the db.update().set().where().returning() chain
    (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([updatedCarData]),
                 }),
      }),
    });
    const result = await updateCarService(1, updatedCarData);
    expect(result).toBe("Car update successfully");
       });
    });

    describe("delete car", () => {
    it("should delete a car and return a success message", async () => {
    const mockDeletedCar = [
      {
        carId: 1,
        carModel: "Corolla",
        manufacturer: "Toyota",
        year: 2020,
        color: "White",
        rentalRate: 100,
        availability: true,
      },
    ];

    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue(mockDeletedCar),
      }),
    });

    const result = await deleteCarService(1);
    expect(result).toBe("Car deleted successfully");
  });

  it("should return 'Car not found' if no car is deleted", async () => {
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([]),
      }),
    });

    const result = await deleteCarService(999); // Non-existent ID
    expect(result).toBe("Car not found");
  });
});
});






