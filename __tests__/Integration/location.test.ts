import request from "supertest";
import app from "../../src/index";
import  db  from "../../src/Drizzle/db";
import { CarTable, LocationTable } from "../../src/Drizzle/schema";
import { afterAll } from '@jest/globals';

let carId: number;
let locationId: number;

beforeAll(async () => {
  const [car] = await db.insert(CarTable).values({
    carModel: "Corolla",
    manufacturer: "Toyota",
    year: 2020,
    color: "White",
    rentalRate: 100,
    availability: true,
  }).returning();

  carId = car.carId;
});

afterAll(async () => {
  // Clean up DB
  await db.delete(LocationTable);
  await db.delete(CarTable);
});

describe("Location API Integration Tests", () => {
  it("should create a new location", async () => {
    const response = await request(app).post("/location").send({
      carId,
      locationName: "Nairobi Branch",
      address: "123 Moi Avenue",
      contactNumber: "0700000000",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty("locationId");
    locationId = response.body.data.locationId;
  });

  it("should fetch all locations", async () => {
    const response = await request(app).get("/location");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should get a location by ID", async () => {
    const response = await request(app).get(`/location/${locationId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.locationId).toBe(locationId);
  });

  it("should update a location", async () => {
    const response = await request(app).put(`/location/${locationId}`).send({
      locationId,
      carId,
      locationName: "Nairobi Updated Branch",
      address: "456 Kenyatta Avenue",
      contactNumber: "0711111111",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.data.locationName).toBe("Nairobi Updated Branch");
  });

  it("should delete a location", async () => {
    const response = await request(app).delete(`/location/${locationId}`);
    expect(response.statusCode).toBe(204);
  });

//   it("should return 404 when getting a deleted location", async () => {
//   const response = await request(app).get(`/location/${locationId}`);
//   expect(response.statusCode).toBe(404);
// });
});
