import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { MaintenanceTable, CarTable } from "../../src/Drizzle/schema";
import { afterAll } from "@jest/globals";

describe("Maintenance Integration Tests", () => {
  let maintenanceId: number;
  let testCarId: number;

  const testCar = {
    carModel: "Civic",
    manufacturer: "Honda",
    year: 2021,
    color: "Silver",
    rentalRate: 120,
    availability: true,
  };

  const testMaintenance = {
    maintenanceDate: new Date().toISOString(),
    description: "Brake pad replacement",
    cost: 2500,
    carId: 0, // will be set after creating testCar
  };

  beforeAll(async () => {
    // Clear old data
    await db.delete(MaintenanceTable);
    await db.delete(CarTable);

    // Insert a test car for foreign key constraint
    const response = await request(app).post("/car").send(testCar);
    testCarId = response.body.data.carId;
    testMaintenance.carId = testCarId;
  });

  afterAll(async () => {
    await db.delete(MaintenanceTable);
    await db.delete(CarTable);
  });

  it("should create a maintenance record", async () => {
    const response = await request(app)
      .post("/maintenance")
      .send(testMaintenance)
      .expect(201);

    expect(response.body).toHaveProperty("message", "Maintenance created successfully");
    expect(response.body.data).toHaveProperty("maintenanceId");

    maintenanceId = response.body.data.maintenanceId;
  });

  it("should fetch all maintenance records", async () => {
    const response = await request(app)
      .get("/maintenance")
      .expect(200);

    expect(response.body).toHaveProperty("message", "Maintenance retrieved successfully");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should fetch a maintenance record by ID", async () => {
    const response = await request(app)
      .get(`/maintenance/${maintenanceId}`)
      .expect(200);

    expect(response.body.data).toHaveProperty("maintenanceId", maintenanceId);
    expect(response.body.data.description).toBe(testMaintenance.description);
  });

  it("should update a maintenance record", async () => {
    const updatedMaintenance = {
      ...testMaintenance,
      maintenanceId,
      description: "Brake pad and oil change",
      cost: 3000,
    };

    const response = await request(app)
      .put(`/maintenance/${maintenanceId}`)
      .send(updatedMaintenance)
      .expect(200);

    expect(response.body).toHaveProperty("message", "Maintenance updated successfully");
    expect(response.body.data.cost).toBe(3000);
  });

  it("should delete a maintenance record", async () => {
    const response = await request(app)
      .delete(`/maintenance/${maintenanceId}`)
      .expect(204); // No Content
  });
});
