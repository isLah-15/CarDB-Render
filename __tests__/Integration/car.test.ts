import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { CarTable } from "../../src/Drizzle/schema";
import { afterAll } from '@jest/globals';

describe("Car Integration Tests", () => {
  let carId: number;

  const testCar = {
    carModel: "Camry",
    manufacturer: "Toyota",
    year: 2020,
    color: "Blue",
    rentalRate: 100,
    availability: true
  };

  // Clean up DB before each test (optional but recommended for test isolation)
  beforeAll(async () => {
    await db.delete(CarTable);
  });

  afterAll(async () => {
    await db.delete(CarTable);
  });

  it("should create a car", async () => {
    const response = await request(app)
      .post("/car")
      .send(testCar)
      .expect(201);

    expect(response.body).toHaveProperty("message", "Car created successfully");
    expect(response.body.data).toHaveProperty("carId");

    carId = response.body.data.carId;
  });

  it("should fetch all cars", async () => {
    const response = await request(app)
      .get("/car")
      .expect(200);

    expect(response.body).toHaveProperty("message", "Cars retrieved successfully");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should fetch a car by ID", async () => {
    const response = await request(app)
      .get(`/car/${carId}`)
      .expect(200);

    expect(response.body.data).toHaveProperty("carId", carId);
    expect(response.body.data.carModel).toBe("Camry");
  });

  it("should update a car", async () => {
    const updatedCar = {
      ...testCar,
      color: "Red",
      carId: carId,
    };

    const response = await request(app)
      .put(`/car/${carId}`)
      .send(updatedCar)
      .expect(200);

    expect(response.body).toHaveProperty("message", "Car updated successfully");
  });

  it("should delete a car", async () => {
    const response = await request(app)
      .delete(`/car/${carId}`)
      .expect(200); // No content
  });
});