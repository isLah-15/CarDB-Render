import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { BookingTable, CarTable, CustomerTable } from "../../src/Drizzle/schema";
import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import { eq } from "drizzle-orm";

describe("Booking Integration Tests", () => {
  let bookingId: number;
  let customerId: number;
  let carId: number;

  const testCustomer = {
    firstName: "Jane", 
    lastName: "Smith", 
    email: "jane@example.com", 
    phone: "0723456789", 
    password: "1234567", 
    address: "Mombasa"
  };

  const testCar = {
    carModel: "Camry",
    manufacturer: "Toyota",
    year: 2020,
    color: "Blue",
    rentalRate: 100,
    availability: true
  };

  let testBooking: any;

   // Clean up DB before each test (optional but recommended for test isolation)
  beforeAll(async () => {
    await db.delete(BookingTable);
    await db.delete(CustomerTable);
    await db.delete(CarTable);

    // Insert test customer and car, then set their IDs
    const [customer] = await db.insert(CustomerTable).values(testCustomer).returning();
    customerId = customer.customerId || customer.customerId || customer.customerId; // Adjust according to your schema

    const [car] = await db.insert(CarTable).values(testCar).returning();
    carId = car.carId || car.carId || car.carId; // Adjust according to your schema

    testBooking = {
       rentalStartDate: new Date('2024-06-01'),
  rentalEndDate: new Date('2024-06-05'),
      totalAmount: 12000,
      customerId, 
      carId, 
    };
  });

  afterAll(async () => {
    await db.delete(BookingTable);
    await db.delete(CustomerTable);
    await db.delete(CarTable);
  });

  it("should create a new booking", async () => {
    const response = await request(app)
      .post("/booking")
      .send(testBooking)
      .expect(201);

    expect(response.body).toHaveProperty("message", "Booking created successfully");
  expect(response.body.data).not.toBeNull();

 console.log("booking:", response.body.data);
  console.log("wiiiiiiiiiiiiiiiiiiiii:", response.body.data[0].bookingId);
    bookingId = response.body.data[0].bookingId;
  });

  it("should retrieve all bookings", async () => {
    const response = await request(app)
      .get("/booking")
      .expect(200);

    expect(response.body).toHaveProperty("message", "Bookings retrieved successfully");
    expect(Array.isArray(response.body.data)).toBe(true);
    
  });

  it("should retrieve a booking by ID", async () => {
    const response = await request(app)
      .get(`/booking/${bookingId}`)
      .expect(200);

    expect(response.body.data).not.toBeNull();
    expect(response.body.data[0].bookingId).toBe(bookingId);
  });

  it("should update a booking", async () => {
    const updatedBooking = {
      ...testBooking,
      rentalEndDate: new Date('2024-06-07'), 
      totalAmount: 25000
    };

     const response = await request(app)
      .put(`/booking/${bookingId}`)
      .send(updatedBooking)
      .expect(200);

    expect(response.body).toHaveProperty("message", "Booking updated successfully");
  });

  it("should delete the booking", async () => {
    const response = await request(app)
      .delete(`/booking/${bookingId}`)
      .expect(200);

  });

});
