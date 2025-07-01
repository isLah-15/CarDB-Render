import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import {
  PaymentTable,
  BookingTable,
  CustomerTable,
  CarTable,
  TIBooking,
} from "../../src/Drizzle/schema";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";

describe("Payment Integration Tests", () => {
  let paymentId: number;
  let testCustomerId: number;
  let testCarId: number;

  const testCustomer = {
  firstName: "Test",
  lastName: "User",
  email: "testuser@example.com",
  phone: "0700000000",
  password: "Password@123", // if hashing is done in controller
  address: "Test Address 123",
};

  const testCar = {
  carModel: "Corolla",
  manufacturer: "Toyota",
  year: 2022,
  color: "Black",
  rentalRate: 1000,
  availability: true,
};

  const testPayment = {
    bookingId: 0, // will be updated in beforeAll
    paymentDate: new Date().toISOString(),
    amount: 1500,
    paymentMethod: "M-Pesa",
  };

  beforeAll(async () => {
  // Clean previous test data (optional)
  await db.delete(PaymentTable);
  await db.delete(BookingTable);
  await db.delete(CustomerTable);
  await db.delete(CarTable);

  const dbcustomer = await db.insert(CustomerTable).values(testCustomer).returning();

  console.log("eeeeeeeeeeeeeeeeeeee ", dbcustomer)


  testCustomerId = dbcustomer[0].customerId

  const DbCar = await db.insert(CarTable).values(testCar).returning();

    console.log("hhhhhhhhhhhhhhhhhhhhhh ", DbCar)


  testCarId = DbCar[0].carId;

  // Create booking
  const bookingRes : TIBooking = {
    customerId: testCustomerId,
    carId: testCarId,
    rentalStartDate: new Date(),
    rentalEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 days
    totalAmount: 1500,
  };
   
    const dbBooking = await db.insert(BookingTable).values(bookingRes).returning()

      console.log("bbbbbbbbbbbbbbbbbb ", dbBooking)


  const testBookingId = dbBooking[0].bookingId;
  testPayment.bookingId = testBookingId == undefined ? 0: testBookingId;
});

  afterAll(async () => {
    await db.delete(PaymentTable);
    await db.delete(BookingTable);
    await db.delete(CustomerTable);
    await db.delete(CarTable);
  });

  it("should create a new payment", async () => {
    const res = await request(app)
      .post("/payment")
      .send(testPayment)
      .expect(201);

    expect(res.body).toHaveProperty("message", "Payment created successfully");
    expect(res.body.data).toHaveProperty("paymentId");
    paymentId = res.body.data.paymentId;
  });

  it("should fetch all payments", async () => {
    const res = await request(app).get("/payment").expect(200);

    expect(res.body).toHaveProperty("message", "Payments retrieved successfully");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should fetch a payment by ID", async () => {
    const res = await request(app).get(`/payment/${paymentId}`).expect(200);

    expect(res.body.data).toHaveProperty("paymentId", paymentId);
    expect(res.body.data.amount).toBe(testPayment.amount);
  });

  it("should return 404 for non-existent payment", async () => {
    const res = await request(app).get("/payment/99999").expect(404);

    expect(res.body).toHaveProperty("message", "Payment not found");
  });

  it("should update a payment record", async () => {
    const updatedPayment = {
      ...testPayment,
      amount: 2500,
    };

    const res = await request(app)
      .put(`/payment/${paymentId}`)
      .send(updatedPayment)
      .expect(200);

    expect(res.body).toHaveProperty("message", "Payment updated successfully");
    expect(res.body.data.amount).toBe(2500);
  });

  it("should fail to update payment with mismatched ID", async () => {
    const res = await request(app)
      .put(`/payment/${paymentId}`)
      .send({ ...testPayment, paymentId: 999 }) // Mismatch
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/does not match/);
  });

  it("should delete the payment", async () => {
    const res = await request(app).delete(`/payment/${paymentId}`).expect(204);
  });

  it("should return 404 when deleting non-existent payment", async () => {
    const res = await request(app).delete(`/payment/${paymentId}`).expect(404);

    expect(res.body).toHaveProperty("message", "Payment not found");
  });
});
