import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import {
  ReservationTable,
  CustomerTable,
  CarTable,
} from "../../src/Drizzle/schema";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

describe("Reservation Integration Tests", () => {
  let reservationId: number;
  let testCustomerId: number;
  let testCarId: number;

  const testCustomer = {
    firstName: "Test",
    lastName: "User",
    email: "testuser@example.com",
    phone: "0700000000",
    password: "Password@123",
    address: "Test Address 123",
  };

  const testCar = {
    carModel: "Axio",
    manufacturer: "Toyota",
    year: 2021,
    color: "White",
    rentalRate: 1200,
    availability: true,
  };

  const testReservation = {
    customerId: 0, // will be updated in beforeAll
    carId: 0, // will be updated in beforeAll
    reservationDate: new Date().toISOString(),
    pickupDate: new Date(Date.now() + 86400000).toISOString(), // +1 day
    returnDate: new Date(Date.now() + 172800000).toISOString(), // +2 days
  };

  beforeAll(async () => {
    // Clean any leftovers from previous runs
    await db.delete(ReservationTable);
    await db.delete(CustomerTable);
    await db.delete(CarTable);

    const [createdCustomer] = await db.insert(CustomerTable).values(testCustomer).returning();
    testCustomerId = createdCustomer.customerId;

    const [createdCar] = await db.insert(CarTable).values(testCar).returning();
    testCarId = createdCar.carId;

    // Update testReservation with real foreign keys
    testReservation.customerId = testCustomerId;
    testReservation.carId = testCarId;
  });

  afterAll(async () => {
    await db.delete(ReservationTable);
    await db.delete(CustomerTable);
    await db.delete(CarTable);
  });

  it("should create a new reservation", async () => {
    const res = await request(app)
      .post("/reservation")
      .send(testReservation)
      .expect(201);

    expect(res.body).toHaveProperty("message", "Reservation created successfully");
    expect(res.body.data).toHaveProperty("reservationId");

    reservationId = res.body.data.reservationId;
  });

  it("should fetch all reservations", async () => {
    const res = await request(app).get("/reservation").expect(200);

    expect(res.body).toHaveProperty("message", "Reservations retrieved successfully");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should fetch a reservation by ID", async () => {
    const res = await request(app).get(`/reservation/${reservationId}`).expect(200);

    expect(res.body.data).toHaveProperty("reservationId", reservationId);
    expect(res.body.data.customerId).toBe(testCustomerId);
  });

//   it("should return 404 for non-existent reservation", async () => {
//     const res = await request(app).get("/reservation/99999").expect(404);

//     expect(res.body).toHaveProperty("message", "Reservation not found");
//   });

  it("should update a reservation record", async () => {
    const updatedReservation = {
      ...testReservation,
      reservationId, // include for ID matching
      returnDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // +3 days
    };

    const res = await request(app)
      .put(`/reservation/${reservationId}`)
      .send(updatedReservation)
      .expect(200);

    expect(res.body).toHaveProperty("message", "Reservation updated successfully");
    expect(new Date(res.body.data.returnDate).getDate()).toBe(
      new Date(updatedReservation.returnDate).getDate()
    );
  });

  it("should fail to update reservation with mismatched ID", async () => {
    const res = await request(app)
      .put(`/reservation/${reservationId}`)
      .send({ ...testReservation, reservationId: 999 }) // ID mismatch
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/does not match/);
  });

  it("should delete the reservation", async () => {
    const res = await request(app).delete(`/reservation/${reservationId}`).expect(204);
  });

//   it("should return 404 when deleting non-existent reservation", async () => {
//     const res = await request(app).delete(`/reservation/${reservationId}`).expect(404);

//     expect(res.body).toHaveProperty("message", "Reservation not found");
//   });
});
