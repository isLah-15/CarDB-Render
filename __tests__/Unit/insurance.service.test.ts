import {
  createInsuranceService,
  deleteInsuranceService,
  getAllInsuranceService,
  getInsuranceById,
  updateInsuranceService,
} from "../../src/Insurance/insurance.service";
import { TIInsurance } from "../../src/Drizzle/schema";
import db from "../../src/Drizzle/db";

// Mock the database
jest.mock("../../src/Drizzle/db", () => {
  const returningMock = jest.fn();
  const valuesMock = jest.fn(() => ({ returning: returningMock }));
  const insertMock = jest.fn(() => ({ values: valuesMock }));

  const findManyMock = jest.fn();
  const findFirstMock = jest.fn();

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
        InsuranceTable: {
          findMany: findManyMock,
          findFirst: findFirstMock,
        },
      },
    },
  };
});

describe("Insurance Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createInsuranceService", () => {
    it("should return the inserted insurance if successful", async () => {
      const mockInsurance: TIInsurance = {
        insuranceId: 1,
        carId: 2,
        provider: "XYZ Insurance",
        policyNumber: "ABC123",
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-05-05"),
      };

      const insertMock = (db.insert as jest.Mock);
      const valuesMock = insertMock().values as jest.Mock;
      const returningMock = valuesMock().returning as jest.Mock;

      returningMock.mockResolvedValueOnce([mockInsurance]);

      const result = await createInsuranceService(mockInsurance);
      expect(result).toEqual(mockInsurance);
    });

    it("should return null if no insurance is inserted", async () => {
      const mockInsurance: TIInsurance = {
        insuranceId: 2,
        carId: 3,
        provider: "ABC Insurance",
        policyNumber: "XYZ789",
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-05-05"),
      };

      const insertMock = (db.insert as jest.Mock);
      const valuesMock = insertMock().values as jest.Mock;
      const returningMock = valuesMock().returning as jest.Mock;

      returningMock.mockResolvedValueOnce([]);

      const result = await createInsuranceService(mockInsurance);
      expect(result).toBeNull();
    });
  });

  describe("getAllInsuranceService", () => {
    it("should return all insurances with car details", async () => {
      const mockInsurances = [
        {
          insuranceId: 1,
          carId: 2,
          provider: "XYZ Insurance",
          policyNumber: "ABC123",
          coverageAmount: 50000,
          expiryDate: new Date("2026-01-01"),
          car: { carId: 2, model: "Toyota" },
        },
      ];

      (db.query.InsuranceTable.findMany as jest.Mock).mockResolvedValueOnce(mockInsurances);

      const result = await getAllInsuranceService();
      expect(result).toEqual(mockInsurances);
    });

    it("should return 'No insurance found' if database returns empty array", async () => {
      (db.query.InsuranceTable.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await getAllInsuranceService();
      expect(result).toBe("No insurance found");
    });
  });

  describe("getInsuranceById", () => {
    it("should return insurance with car details if found", async () => {
      const mockInsurance = {
        insuranceId: 1,
        carId: 2,
        provider: "XYZ Insurance",
        policyNumber: "ABC123",
        coverageAmount: 50000,
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-05-05"),
        car: { carId: 2, model: "Toyota" },
      };

      (db.query.InsuranceTable.findFirst as jest.Mock).mockResolvedValueOnce(mockInsurance);

      const result = await getInsuranceById(1);
      expect(result).toEqual(mockInsurance);
    });

    it("should return 'Insurance not found' if no insurance is returned", async () => {
      (db.query.InsuranceTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await getInsuranceById(999);
      expect(result).toBe("Insurance not found");
    });
  });

  describe("updateInsuranceService", () => {
  it("should update the insurance and return the updated object", async () => {
    const mockId = 1;
    const mockInsurance: any = {
      insuranceId: mockId,
      carId: 2,
      provider: "XYZ Insurance",
      policyNumber: "NEW123",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-12"),
    };

    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([mockInsurance]),
        }),
      }),
    });

    const result = await updateInsuranceService(mockId, mockInsurance);

    expect(result).toEqual(expect.objectContaining({
      insuranceId: mockId,
      carId: 2,
      provider: "XYZ Insurance",
      policyNumber: "NEW123",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-12"),
    }));
  });
});


  describe("deleteInsuranceService", () => {
    it("should return success message if insurance is deleted", async () => {
      const mockId = 1;

      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([{ insuranceId: mockId }]),
        }),
      });

      const result = await deleteInsuranceService(mockId);
      expect(result).toBe("Insurance deleted successfully");
    });

    it("should return not found message if no insurance is deleted", async () => {
      const mockId = 999;

      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      const result = await deleteInsuranceService(mockId);
      expect(result).toBe("Insurance not found");
    });
  });
});