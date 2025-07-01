import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { CustomerTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";

describe("Auth Integration Tests", () => {
  const testUser = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    password: "testpass123",
    phone: "0712345678",
    address: "Mombasa",
  };

  afterAll(async () => {
    // Delete test user after tests
    await db.delete(CustomerTable).where(eq(CustomerTable.email, testUser.email));
    await db.$client.end(); 
  });

  describe("POST /auth/register", () => {
    it("should register a new user and send email", async () => {
      const res = await request(app).post("/auth/register").send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toMatch(/Verification code sent/i);
    });

    it("should prevent duplicate registration", async () => {
      const res = await request(app).post("/auth/register").send(testUser);

      // Adjust based on actual controller behavior
      expect(res.body.error).toMatch(/duplicate/i);
    });
  });

  describe("POST /auth/verify", () => {
    let verificationCode: string;

    beforeAll(async () => {
      const user = await db.query.CustomerTable.findFirst({
        where: eq(CustomerTable.email, testUser.email),
      });

      if (!user) throw new Error("Test user not found");
      verificationCode = user.verificationCode!;
    });

    it("should verify the user with correct code", async () => {
      const res = await request(app).post("/auth/verify").send({
        email: testUser.email,
        code: verificationCode,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/verified successfully/i);
    });

    it("should fail with incorrect verification code", async () => {
      const res = await request(app).post("/auth/verify").send({
        email: testUser.email,
        code: "000000",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/Invalid verification code/i);
    });
  });

  describe("POST /auth/login", () => {
    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toMatchObject({
        email: testUser.email,
        first_name: testUser.firstName,
        last_name: testUser.lastName,
        role: "customer",
      });
    });

    it("should reject invalid password", async () => {
      const res = await request(app).post("/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/Invalid credentials/i);
    });

    it("should reject non-existent user", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "notfound@example.com",
        password: "whatever",
      });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/User not found/i);
    });
  });
});
