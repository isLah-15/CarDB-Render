import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { CustomerTable } from "../../src/Drizzle/schema";
import { afterAll } from "@jest/globals";

describe("Customer Integration Tests", () => {
  let customerId: number;

  const testCustomer = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    phone: "0712345678",
    password: "securePassword123",
    role: "customer",
    address: "Nairobi, Kenya",
    verificationCode: "ABC123",
    isVerified: false,
  };

  beforeAll(async () => {
    await db.delete(CustomerTable);
  });

  afterAll(async () => {
    await db.delete(CustomerTable);
  });

  it("should create a customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send(testCustomer)
      .expect(201);

    expect(response.body).toHaveProperty("message", "Customer created successfully");
    expect(response.body.data).toHaveProperty("customerId");

    customerId = response.body.data.customerId;
  });

  it("should fetch all customers", async () => {
    const response = await request(app)
      .get("/customer")
      .expect(200);

    expect(response.body).toHaveProperty("message", "Customers retrieved successfully");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should fetch a customer by ID", async () => {
    const response = await request(app)
      .get(`/customer/${customerId}`)
      .expect(200);

    expect(response.body.data).toHaveProperty("customerId", customerId);
    expect(response.body.data.firstName).toBe("Jane");
  });

  it("should update a customer", async () => {
    const updatedCustomer = {
      ...testCustomer,
      customerId: customerId,
      address: "Mombasa, Kenya",
    };

    const response = await request(app)
      .put(`/customer/${customerId}`)
      .send(updatedCustomer)
      .expect(200);

    // expect(response.body).toHaveProperty("message", "Customer updated successfully");
    expect(response.body.data.address).toBe("Mombasa, Kenya");
  });

  it("should delete a customer", async () => {
    const response = await request(app)
      .delete(`/customer/${customerId}`)
      .expect(204);
  });

//   it("should return 404 for non-existent customer", async () => {
//     const response = await request(app)
//       .get("/customer/9999")
//       .expect(404);

//     expect(response.body).toHaveProperty("message", "Customer not found");
//   });

  it("should return 400 for invalid customer ID", async () => {
    const response = await request(app)
      .get("/customer/invalid")
      .expect(400);

    expect(response.body).toHaveProperty("message", "Invalid ID");
  });
});
