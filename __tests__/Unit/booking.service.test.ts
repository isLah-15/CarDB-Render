import { createBookingService, deleteBookingService, getAllBookingService, getBookingsById, updateBookingService } from "../../src/Booking/booking.service";
import { TIBooking } from "../../src/Drizzle/schema";
import db from "../../src/Drizzle/db";

// Mock the database
jest.mock("../../src/Drizzle/db", () => {
  const returningMock = jest.fn();
  const valuesMock = jest.fn(() => ({ returning: returningMock }));
  const insertMock = jest.fn(() => ({ values: valuesMock }));

  const findManyMock = jest.fn();

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
        BookingTable: {
          findMany: findManyMock,
        },
      },
    },
  };
});

describe("Booking Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createBookingService", () => {
    it("should return the inserted booking if successful", async () => {
      const mockBooking: TIBooking = {
        bookingId: 1,
        customerId: 1,
        carId: 2,
        rentalStartDate: new Date("2025-06-05"),
        rentalEndDate: new Date("2025-06-10"),
        totalAmount: 15000,
      };

      // Mock the returning chain
      const insertMock = (db.insert as jest.Mock);
      const valuesMock = insertMock().values as jest.Mock;
      const returningMock = valuesMock().returning as jest.Mock;

      returningMock.mockResolvedValueOnce(mockBooking);

      const result = await createBookingService(mockBooking);
      expect(result).toEqual(mockBooking);
    });

    it("should return null if no booking is inserted", async () => {
      const mockBooking: TIBooking = {
        bookingId: 2,
        customerId: 2,
        carId: 3,
        rentalStartDate: new Date("2025-06-06"),
        rentalEndDate: new Date("2025-06-09"),
        totalAmount: 12000,
      };

      const insertMock = (db.insert as jest.Mock);
      const valuesMock = insertMock().values as jest.Mock;
      const returningMock = valuesMock().returning as jest.Mock;

      returningMock.mockResolvedValueOnce([]);

      const result = await createBookingService(mockBooking);
      expect(result).toEqual([]); 

    });
  });
  describe("getAllBookingService", () => {
    it("should return all bookings with customer, car, and payments if found", async () => {
      const mockBookings = [
        {
          bookingId: 1,
          customerId: 1,
          carId: 2,
          rentalStartDate: new Date("2025-06-05"),
          rentalEndDate: new Date("2025-06-10"),
          totalAmount: 15000,
          customer: { customerId: 1, fullName: "John Doe" },
          car: { carId: 2, model: "Toyota" },
          payments: [{ paymentId: 1, amountPaid: 15000 }],
        },
      ];

      (db.query.BookingTable.findMany as jest.Mock).mockResolvedValueOnce(mockBookings);

      const result = await getAllBookingService();
      expect(result).toEqual(mockBookings);
    });

    it("should return 'No bookings found' if database returns empty array", async () => {
      (db.query.BookingTable.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await getAllBookingService();
      expect(result).toBe("No bookings found");
    });
  });


  describe("getBookingsByIdService", () => {
  it("should return booking with customer, car, and payments if found", async () => {
    const mockBookingId = 1;
    const mockBookings = [
      {
        bookingId: mockBookingId,
        customerId: 1,
        carId: 2,
        rentalStartDate: new Date("2025-06-05"),
        rentalEndDate: new Date("2025-06-10"),
        totalAmount: 15000,
        customer: { customerId: 1, fullName: "John Doe" },
        car: { carId: 2, model: "Toyota" },
        payments: [{ paymentId: 1, amountPaid: 15000 }],
      },
    ];

    (db.query.BookingTable.findMany as jest.Mock).mockResolvedValueOnce(mockBookings);

    const result = await getBookingsById(mockBookingId);
    expect(result).toEqual(mockBookings);
  });

  it("should return 'Booking not found' if no booking is returned", async () => {
    const mockBookingId = 999;

    (db.query.BookingTable.findMany as jest.Mock).mockResolvedValueOnce([]);

    const result = await getBookingsById(mockBookingId);
    expect(result).toBe("Booking not found");
  });
});

describe("updateBookingService", () => {
  it("should update the booking and return success message", async () => {
    const mockId = 1;
    const mockBooking: TIBooking = {
      customerId: 1,
      carId: 2,
      rentalStartDate: new Date("2025-06-05"),
      rentalEndDate: new Date("2025-06-10"),
      totalAmount: 15000,
    };

    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([mockBooking]),
        }),
      }),
    });

    const result = await updateBookingService(mockId, mockBooking);
    expect(result).toBe("Booking update successfully");
  });
});

describe("deleteBookingService", () => {
  it("should return success message if booking is deleted", async () => {
    const mockId = 1;

    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([{ bookingId: mockId }]),
      }),
    });

    const result = await deleteBookingService(mockId);
    expect(result).toBe("Booking deleted successfully");
  });

  it("should return not found message if no booking is deleted", async () => {
    const mockId = 999;

    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce([]),
      }),
    });

    const result = await deleteBookingService(mockId);
    expect(result).toBe("Booking not found");
  });
});




});


//   describe("get all bookings service", () => {
//     it("should return all bookings with customer, car, and payments", async () => {
//       const mockBookings = [
//         {
//           bookingId: 1,
//           customerId: 1,
//           carId: 2,
//           rentalStartDate: new Date("2025-06-03"),
//           rentalEndDate: new Date("2025-06-07"),
//           customer: {
//             customerId: 1,
//             name: "John Doe",
//             email: "john@example.com",
//           },
//           car: {
//             carId: 2,
//             carModel: "Civic",
//             manufacturer: "Honda",
//             color: "Red",
//             rentalRate: 90,
//             availability: true,
//             year: 2019,
//           },
//           payments: [
//             {
//               paymentId: 1,
//               amount: 180,
//               method: "Credit Card",
//               bookingId: 1,
//             },
//           ],
//         },
//       ];

//       // @ts-ignore: mock implementation
//       db.query.BookingTable.findMany.mockResolvedValue(mockBookings);

//       const result = await getAllBookingService();
//       expect(result).toEqual(mockBookings);
//     });

//     it("should return 'No bookings found' if no bookings exist", async () => {
//       // @ts-ignore: mock implementation
//       db.query.BookingTable.findMany.mockResolvedValue([]);

//       const result = await getAllBookingService();
//       expect(result).toBe("No bookings found");
//     });
//   });

