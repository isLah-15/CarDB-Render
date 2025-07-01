import {
  createLocationService,
  deleteLocationService,
  getAllLocationService,
  getLocationById,
  updateLocationService,
} from "../../src/Location/location.service";
import { TILocation } from "../../src/Drizzle/schema";
import db from "../../src/Drizzle/db";
import { updateMaintenanceService } from "../../src/Maintenance/maintenance.service";

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
        LocationTable: {
          findMany: findManyMock,
          findFirst: findFirstMock,
        },
      },
    },
  };
});

describe("Location Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createLocationService", () => {
    it("should return the inserted location if successful", async () => {
      const mockLocation: TILocation = {
        locationId: 1,
        carId: 1,
        locationName: "Nairobi",
        address: "Moi Avenue",
        contactNumber: "0712345678"
      };

      const insertMock = (db.insert as jest.Mock);
      const valuesMock = insertMock().values as jest.Mock;
      const returningMock = valuesMock().returning as jest.Mock;

      returningMock.mockResolvedValueOnce([mockLocation]);

      const result = await createLocationService(mockLocation);
      expect(result).toEqual(mockLocation);
    });

    it("should return null if no location is inserted", async () => {
      const mockLocation: TILocation = {
        locationId: 2,
        carId: 1,
        locationName: "Nairobi",
        address: "Moi Avenue",
        contactNumber: "0712345678"
      };

      const insertMock = (db.insert as jest.Mock);
      const valuesMock = insertMock().values as jest.Mock;
      const returningMock = valuesMock().returning as jest.Mock;

      returningMock.mockResolvedValueOnce([]);

      const result = await createLocationService(mockLocation);
      expect(result).toBeNull();
    });
  });

  describe("getAllLocationService", () => {
    it("should return all locations if found", async () => {
      const mockLocations = [
        {
          locationId: 1,
          carId: 1,
        locationName: "Nairobi",
        address: "Moi Avenue",
        contactNumber: "0712345678"
        },
      ];

      (db.query.LocationTable.findMany as jest.Mock).mockResolvedValueOnce(mockLocations);

      const result = await getAllLocationService();
      expect(result).toEqual(mockLocations);
    });

    it("should return 'No locations found' if database returns empty array", async () => {
      (db.query.LocationTable.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await getAllLocationService();
      expect(result).toBe("No locations found");
    });
  });

  describe("getLocationById", () => {
    it("should return location if found", async () => {
      const mockLocation = {
        locationId: 1,
        carId: 1,
        locationName: "Nairobi",
        address: "Moi Avenue",
        contactNumber: "0712345678"
      };

      (db.query.LocationTable.findFirst as jest.Mock).mockResolvedValueOnce(mockLocation);

      const result = await getLocationById(1);
      expect(result).toEqual(mockLocation);
    });

    it("should return 'Location not found' if no location is found", async () => {
      (db.query.LocationTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await getLocationById(999);
      expect(result).toBe("Location not found");
    });
  });

  describe("updateMaintenanceService", () => {
  it("should update the maintenance and return the updated object", async () => {
    const mockId = 1;
    const mockMaintenance = {
      maintenanceId: 1,
      carId: 2,
      maintenanceDate: new Date("2025-06-01T00:00:00Z"),
      description: "Brake check",
      cost: 4000,
    };

    // Mock DB chain
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([mockMaintenance]),
        }),
      }),
    });

    const result = await updateMaintenanceService(mockId, mockMaintenance);

    expect(result).toEqual(
      expect.objectContaining({
        maintenanceId: 1,
        carId: 2,
        maintenanceDate: new Date("2025-06-01T00:00:00Z"),
        description: "Brake check",
        cost: 4000,
      })
    );
  });
});

  describe("deleteLocationService", () => {
    it("should return success message if location is deleted", async () => {
      const mockId = 1;

      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([{ locationId: mockId }]),
        }),
      });

      const result = await deleteLocationService(mockId);
      expect(result).toBe("Location deleted successfully");
    });

    it("should return not found message if no location is deleted", async () => {
      const mockId = 999;

      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([]),
        }),
      });

      const result = await deleteLocationService(mockId);
      expect(result).toBe("Location not found");
    });
  });
});
