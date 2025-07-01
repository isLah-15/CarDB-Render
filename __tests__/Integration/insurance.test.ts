import request from "supertest";
import app from "../../src/index";
import  db  from "../../src/Drizzle/db";
import { CarTable, InsuranceTable } from "../../src/Drizzle/schema";
import { afterAll } from 
'@jest/globals';
describe("Insurance API Integration", () => {
  let testCarId: number;
  let createdInsuranceId: number;
  let testInsurance: {
    carId: number;
    provider: string;
    policyNumber: string;
    startDate: string;
    endDate: string;
  };

  beforeAll(async () => {
    // Create a test car (required for insurance)
    const [car] = await db
      .insert(CarTable)
      .values({
        carModel: "Test Model",
        manufacturer: "Test Manufacturer",
        year: 2024,
        color: "Black",
        rentalRate: 100,
        availability: true,
      })
      .returning();

    testCarId = car.carId;

    testInsurance = {
      carId: testCarId,
      provider: "AAR",
      policyNumber: "AAR123456",
      startDate: "2025-06-01T00:00:00.000Z",
      endDate: "2026-06-01T00:00:00.000Z",
    };
  });

  afterAll(async () => {
    // Clean up insurance and car
    await db.delete(InsuranceTable).execute();
    await db.delete(CarTable).execute();
  });

  it("should create a new insurance", async () => {
    const res = await request(app)
      .post("/insurance")
      .send(testInsurance);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("insuranceId");

    createdInsuranceId = res.body.data.insuranceId;
  });

  it("should retrieve all insurances", async () => {
    const res = await request(app).get("/insurance");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get insurance by ID", async () => {
    const res = await request(app).get(`/insurance/${createdInsuranceId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.insuranceId).toBe(createdInsuranceId);
  });

  it("should return 404 for non-existent insurance ID", async () => {
    const res = await request(app).get("/insurance/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it("should update the insurance", async () => {
  const updatedData = {
    insuranceId: createdInsuranceId, // ✅ this must match req.params.id
    carId: testCarId,
    provider: "New Provider",
    policyNumber: "XYZ456",
    startDate: "2025-07-01T00:00:00Z",
    endDate: "2026-07-01T00:00:00Z",
  };

  const res = await request(app)
    .put(`/insurance/${createdInsuranceId}`)
    // .set("Authorization", `Bearer ${testToken}`) // if route is protected
    .send(updatedData);

  expect(res.statusCode).toBe(200);
  expect(res.body.data.insuranceId).toBe(createdInsuranceId);
});

  it("should delete the insurance", async () => {
    const res = await request(app).delete(`/insurance/${createdInsuranceId}`);

    expect(res.statusCode).toBe(204);
  });

  it("should return 404 for deleting non-existent insurance", async () => {
    const res = await request(app).delete(`/insurance/999999`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});
