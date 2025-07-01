import {
  createReservationService,
  deleteReservationService,
  getAllReservationService,
  getReservationById,
  updateReservationService,
} from "../../src/Reservation/reservation.service";
import db from "../../src/Drizzle/db";
import { TIReservation } from "../../src/Drizzle/schema";

// Mock db module
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
        ReservationTable: {
          findMany: jest.fn(),
          findFirst: jest.fn(),
        },
      },
    },
  };
});

describe("Reservation Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockReservation: TIReservation = {
    customerId: 1,
    carId: 2,
    reservationDate: new Date("2025-06-01"),
    pickupDate: new Date("2025-06-05"),
    returnDate: new Date("2025-06-10"),

  };

  describe("createReservationService", () => {
    it("should return inserted reservation if successful", async () => {
      const insertMock = (db.insert as jest.Mock);
      const valuesMock = insertMock().values as jest.Mock;
      const returningMock = valuesMock().returning as jest.Mock;

      returningMock.mockResolvedValueOnce([mockReservation]);

      const result = await createReservationService(mockReservation);
      expect(result).toEqual(mockReservation);
    });

    it("should return null if no reservation is inserted", async () => {
      const insertMock = (db.insert as jest.Mock);
      const valuesMock = insertMock().values as jest.Mock;
      const returningMock = valuesMock().returning as jest.Mock;

      returningMock.mockResolvedValueOnce([]);

      const result = await createReservationService(mockReservation);
      expect(result).toBeNull();
    });
  });

  describe("getAllReservationService", () => {
    it("should return all reservations if found", async () => {
      (db.query.ReservationTable.findMany as jest.Mock).mockResolvedValueOnce([mockReservation]);

      const result = await getAllReservationService();
      expect(result).toEqual([mockReservation]);
    });

    it("should return 'No reservation found' if none exist", async () => {
      (db.query.ReservationTable.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await getAllReservationService();
      expect(result).toBe("No reservation found");
    });
  });

  describe("getReservationById", () => {
    it("should return the reservation if found", async () => {
      (db.query.ReservationTable.findFirst as jest.Mock).mockResolvedValueOnce(mockReservation);

      const result = await getReservationById(1);
      expect(result).toEqual(mockReservation);
    });

    it("should return 'Reservation not found' if none match", async () => {
      (db.query.ReservationTable.findFirst as jest.Mock).mockResolvedValueOnce(null);

      const result = await getReservationById(999);
      expect(result).toBe("Reservation not found");
    });
  });

  describe("updateReservationService", () => {
    it("should return success message after update", async () => {
      const returningMock = jest.fn().mockResolvedValueOnce([mockReservation]);
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: returningMock,
          }),
        }),
      });

      const result = await updateReservationService(1, mockReservation);
      expect(result).toBe("Reservation update successfully");
    });
  });

  describe("deleteReservationService", () => {
    it("should return success message if deletion successful", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([mockReservation]),
        }),
      });

      const result = await deleteReservationService(1);
      expect(result).toBe("Reservation deleted successfully");
    });

    it("should return 'Reservation not found' if no rows deleted", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      const result = await deleteReservationService(999);
      expect(result).toBe("Reservation not found");
    });
  });
});
