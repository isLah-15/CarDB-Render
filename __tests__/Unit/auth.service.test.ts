import {
  createUserService,
  getUserByEmailService,
  verifyUserService,
  userLoginService,
} from "../../src/Auth/auth.service";

import db from "../../src/Drizzle/db";
import { CustomerTable } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  update: jest.fn(),
  query: {
    CustomerTable: {
      findFirst: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Auth Service Tests", () => {
  describe("createUserService", () => {
    it("should create a new user and return it", async () => {
      const mockUser = {
        customerId: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "0712345678",
        address: "123 Main St",
        password: "hashedpassword",
        role: "customer",
        isVerified: false,
        verificationCode: "123456",
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([mockUser]),
        }),
      });

      const result = await createUserService(mockUser);
      expect(db.insert).toHaveBeenCalledWith(CustomerTable);
      expect(result).toEqual(mockUser);
    });
  });

  describe("getUserByEmailService", () => {
    it("should return a user by email", async () => {
      const email = "john@example.com";
      const mockUser = {
        customerId: 1,
        email,
        password: "hashedpassword",
      };

      (db.query.CustomerTable.findFirst as jest.Mock).mockResolvedValueOnce(
        mockUser
      );

      const result = await getUserByEmailService(email);
      expect(result).toEqual(mockUser);
    });

    it("should return null if user is not found", async () => {
      const email = "notfound@example.com";

      (db.query.CustomerTable.findFirst as jest.Mock).mockResolvedValueOnce(
        null
      );

      const result = await getUserByEmailService(email);
      expect(result).toBeNull();
    });
  });

  describe("verifyUserService", () => {
    it("should update user to verified", async () => {
      const email = "john@example.com";

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(undefined),
        }),
      });

      await verifyUserService(email);
      expect(db.update).toHaveBeenCalledWith(CustomerTable);
    });
  });

  describe("userLoginService", () => {
    it("should return user with login details", async () => {
      const validUserInput = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "0712345678",
        address: "123 Main St",
        password: "password123",
      };

      const mockUser = {
        customerId: 1,
        firstName: "John",
        lastName: "Doe",
        email: validUserInput.email,
        password: "hashedpassword",
        role: "customer",
        isVerified: true,
      };

      (db.query.CustomerTable.findFirst as jest.Mock).mockResolvedValueOnce(
        mockUser
      );

      const validResult = await userLoginService(validUserInput);
      expect(validResult).toEqual(mockUser);

      const invalidUserInput = {
        firstName: "",
        lastName: "",
        email: "wrong@example.com",
        phone: "",
        address: "",
        password: "doesntmatter",
      };

      (db.query.CustomerTable.findFirst as jest.Mock).mockResolvedValueOnce(
        null
      );

      const invalidResult = await userLoginService(invalidUserInput);
      expect(invalidResult).toBeNull();
    });
  });
});
