import {
  createMaintenanceService, deleteMaintenanceService, getAllMaintenanceService, getMaintenanceById, updateMaintenanceService,
} from "../../src/Maintenance/maintenance.service";

import { MaintenanceTable, TIMaintenance } from "../../src/Drizzle/schema";
import db from "../../src/Drizzle/db";
import { eq } from "drizzle-orm";

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
        MaintenanceTable: {
          findMany: findManyMock,
          findFirst: findFirstMock,
        },
      },
    },
  };
});

describe("Maintenance Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createMaintenanceService", () => {
    it("should return the inserted maintenance if successful", async () => {
      const mockMaintenance: TIMaintenance = {
        maintenanceId: 1,
        carId: 2,
        maintenanceDate: new Date("2025-06-01"),
        description: "Oil change",
        cost: 3000,
      };

      const insertMock = (db.insert as jest.Mock);
      const valuesMock = insertMock().values as jest.Mock;
      const returningMock = valuesMock().returning as jest.Mock;
      returningMock.mockResolvedValueOnce([mockMaintenance]);

      const result = await createMaintenanceService(mockMaintenance);
      expect(result).toEqual(mockMaintenance);
    });

    it("should return null if no maintenance is inserted", async () => {
      const mockMaintenance: TIMaintenance = {
        maintenanceId: 2,
        carId: 3,
        maintenanceDate: new Date("2025-06-01"),
        description: "Tire rotation",
        cost: 1500,
      };

      const insertMock = (db.insert as jest.Mock);
      const valuesMock = insertMock().values as jest.Mock;
      const returningMock = valuesMock().returning as jest.Mock;
      returningMock.mockResolvedValueOnce([]);

      const result = await createMaintenanceService(mockMaintenance);
      expect(result).toBeNull();
    });
  });

  describe("getAllMaintenanceService", () => {
    it("should return all maintenance records with car details if found", async () => {
      const mockData = [{ maintenanceId: 1, carId: 2, car: { model: "Toyota" } }];
      (db.query.MaintenanceTable.findMany as jest.Mock).mockResolvedValueOnce(mockData);

      const result = await getAllMaintenanceService();
      expect(result).toEqual(mockData);
    });

    it("should return 'No maintenance found' if empty array is returned", async () => {
      (db.query.MaintenanceTable.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await getAllMaintenanceService();
      expect(result).toBe("No maintenance found");
    });
  });

  describe("getMaintenanceById", () => {
    it("should return maintenance record if found", async () => {
      const mockData = [{ maintenanceId: 1, carId: 2, car: { model: "Toyota" } }];
      (db.query.MaintenanceTable.findMany as jest.Mock).mockResolvedValueOnce(mockData);

      const result = await getMaintenanceById(1);
      expect(result).toEqual(mockData);
    });

    it("should return 'Maintenance not found' if no record is found", async () => {
      (db.query.MaintenanceTable.findMany as jest.Mock).mockResolvedValueOnce(null);

      const result = await getMaintenanceById(99);
      expect(result).toBe("Maintenance not found");
    });
  });

  describe("updateMaintenanceService", () => {
  it("should return the updated maintenance object", async () => {
    const mockMaintenance = {
      carId: 2,
      maintenanceDate: new Date("2025-06-01"),
      description: "Brake check",
      cost: 4000,
    };

    // Mock db.update().set().where().returning()
    const mockReturning = jest.fn().mockResolvedValueOnce([mockMaintenance]);
    const mockWhere = jest.fn(() => ({ returning: mockReturning }));
    const mockSet = jest.fn(() => ({ where: mockWhere }));
    (db.update as jest.Mock).mockImplementation(() => ({
      set: mockSet,
    }));

    const result = await updateMaintenanceService(1, mockMaintenance);

    expect(result).toEqual(mockMaintenance);
    expect(mockSet).toHaveBeenCalledWith(mockMaintenance);
    expect(mockWhere).toHaveBeenCalledWith(eq(MaintenanceTable.maintenanceId, 1));
  });

  it("should return null if update returns empty array", async () => {
    const mockMaintenance = {
      maintenanceId: 1,
      carId: 2,
      maintenanceDate: new Date("2025-06-01"),
      description: "Brake check",
      cost: 4000,
    };

    // Simulate no match (empty array)
    const mockReturning = jest.fn().mockResolvedValueOnce([]);
    const mockWhere = jest.fn(() => ({ returning: mockReturning }));
    const mockSet = jest.fn(() => ({ where: mockWhere }));
    (db.update as jest.Mock).mockImplementation(() => ({
      set: mockSet,
    }));

    const result = await updateMaintenanceService(1, mockMaintenance);

    expect(result).toBeNull();
  });
});

  describe("deleteMaintenanceService", () => {
    it("should return success message if deleted", async () => {
      const mockId = 1;

      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([{ maintenanceId: mockId }]),
        }),
      });

      const result = await deleteMaintenanceService(mockId);
      expect(result).toBe("Maintenance deleted successfully");
    });

    it("should return 'Maintenance not found' if nothing deleted", async () => {
      const mockId = 999;

      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      const result = await deleteMaintenanceService(mockId);
      expect(result).toBe("Maintenance not found");
    });
  });
});
