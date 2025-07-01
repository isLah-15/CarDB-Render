import {
  createPaymentService,
  deletePaymentService,
  getAllPaymentService,
  getPaymentById,
  updatePaymentService,
} from "../../src/Payment/payment.service";
import db from "../../src/Drizzle/db";
import { TIPayment } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => {
  const returningMock = jest.fn();
  const valuesMock = jest.fn(() => ({ returning: returningMock }));
  const insertMock = jest.fn(() => ({ values: valuesMock }));

  return {
    __esModule: true,
    default: {
      insert: insertMock,
      update: jest.fn(() => ({
        set: jest.fn(() => ({
          where: jest.fn(() => ({
            returning: jest.fn(),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        where: jest.fn(() => ({
          returning: jest.fn(),
        })),
      })),
      query: {
        PaymentTable: {
          findMany: jest.fn(),
          findFirst: jest.fn(),
        },
      },
    },
  };
});

describe("Payment Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPaymentService", () => {
    it("should return inserted payment if successful", async () => {
      const mockPayment: TIPayment = {
        bookingId: 1,
        paymentDate: new Date(),
        amount: 1000,
        paymentMethod: "credit_card",
      };

      const insertMock = (db.insert as jest.Mock);
      const valuesMock = insertMock().values as jest.Mock;
      const returningMock = valuesMock().returning as jest.Mock;

      returningMock.mockResolvedValueOnce([mockPayment]);

      const result = await createPaymentService(mockPayment);
      expect(result).toEqual(mockPayment);
    });

    it("should return null if insertion fails", async () => {
      const mockPayment: TIPayment = {
        bookingId: 1,
        paymentDate: new Date(),
        amount: 1000,
        paymentMethod: "credit_card",
      };

      const insertMock = (db.insert as jest.Mock);
      const valuesMock = insertMock().values as jest.Mock;
      const returningMock = valuesMock().returning as jest.Mock;

      returningMock.mockResolvedValueOnce([]);

      const result = await createPaymentService(mockPayment);
      expect(result).toBeNull();
    });
  });

  describe("getAllPaymentService", () => {
    it("should return all payments with booking details", async () => {
      const mockPayments = [
        {
          paymentId: 1,
          amount: 1000,
          booking: { bookingId: 1, totalAmount: 1000 },
        },
      ];

      (db.query.PaymentTable.findMany as jest.Mock).mockResolvedValueOnce(mockPayments);

      const result = await getAllPaymentService();
      expect(result).toEqual(mockPayments);
    });

    it("should return 'No payments found' if no payments exist", async () => {
      (db.query.PaymentTable.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await getAllPaymentService();
      expect(result).toBe("No payments found");
    });
  });

  describe("getPaymentById", () => {
    it("should return payment with booking if found", async () => {
      const mockPayment = {
        paymentId: 1,
        booking: { bookingId: 1 },
        amount: 1000,
        paymentMethod: "credit_card",
      };

      (db.query.PaymentTable.findFirst as jest.Mock).mockResolvedValueOnce(mockPayment);

      const result = await getPaymentById(1);
      expect(result).toEqual(mockPayment);
    });

    it("should return 'Payment not found' if none exists", async () => {
      (db.query.PaymentTable.findFirst as jest.Mock).mockResolvedValueOnce(null);

      const result = await getPaymentById(999);
      expect(result).toBe("Payment not found");
    });
  });

  describe("updatePaymentService", () => {
    it("should update payment and return success message", async () => {
      const mockPayment: TIPayment = {
        bookingId: 1,
        paymentDate: new Date(),
        amount: 1000,
        paymentMethod: "credit_card",
      };

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([mockPayment]),
          }),
        }),
      });

      const result = await updatePaymentService(1, mockPayment);
      expect(result).toBe("Payment update successfully");
    });
  });

  describe("deletePaymentService", () => {
    it("should delete payment and return success message", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([{ paymentId: 1 }]),
        }),
      });

      const result = await deletePaymentService(1);
      expect(result).toBe("Payment deleted successfully");
    });

    it("should return 'Payment not found' if no record deleted", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      const result = await deletePaymentService(999);
      expect(result).toBe("Payment not found");
    });
  });
});