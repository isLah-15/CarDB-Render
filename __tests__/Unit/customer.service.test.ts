import { createCustomerService, deleteCustomerService, getAllCustomerByIdService, getAllCustomerService, updateCustomerService } from "../../src/Customer/customer.service";
import db from "../../src/Drizzle/db";
import { TICustomer } from "../../src/Drizzle/schema";

// Mock db.insert().values().returning()
jest.mock("../../src/Drizzle/db", () => ({
  db: {
    insert: jest.fn(() => ({
      values: jest.fn(() => ({
        returning: jest.fn(),
      })),
    })),
  },
}));

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
        CustomerTable: {
          findMany: findManyMock,
          findFirst: jest.fn()
        },
      },
    },
  };
});

describe("Customer Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

   describe("createBookingService", () => {
      it("should return the inserted booking if successful", async () => {
        const mockCustomer: TICustomer = {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "0712345678",
          password: "Mickey4321",
          role: "customer",
          address: "123 Main St",
          verificationCode: "ABC123",
          isVerified: false,
        };
        // Mock the returning chain
        const insertMock = (db.insert as jest.Mock);
              const valuesMock = insertMock().values as jest.Mock;
              const returningMock = valuesMock().returning as jest.Mock;
        
              returningMock.mockResolvedValueOnce([mockCustomer]);
        
              const result = await createCustomerService(mockCustomer);
              expect(result).toEqual(mockCustomer);
              });
            it("should return null if no customer is inserted", async () => {
                  const mockCustomer: TICustomer = {
                    firstName: "Jane",
                    lastName: "Doe",
                    email: "jane@example.com",
                    phone: "0712345678",
                    password: "Mickey4321",
                    role: "customer",
                    address: "123 Main St",
                    verificationCode: "ABC123",
                    isVerified: false,
                  };
                const insertMock = (db.insert as jest.Mock);
                const valuesMock = insertMock().values as jest.Mock;
                const returningMock = valuesMock().returning as jest.Mock;

                returningMock.mockResolvedValueOnce([]);

                const result = await createCustomerService(mockCustomer);
                expect(result).toBeNull();
    });
  });

  describe("getAllCustomerService", () => {
    it("should return all customers with reservations if found", async () => {
      const mockCustomers = [
        {
          customerId: 1,
          fullName: "John Doe",
          email: "john@example.com",
          phone: "0712345678",
          address: "123 Main St",
          isVerified: false,
          reservations: [
            {
              bookingId: 1,
              carId: 2,
              rentalStartDate: new Date("2025-06-05"),
              rentalEndDate: new Date("2025-06-10"),
              totalAmount: 15000,
              car: { carId: 2, model: "Toyota" },
              payments: [{ paymentId: 1, amountPaid: 15000 }],
            },
          ],
        },
      ];

      (db.query.CustomerTable.findMany as jest.Mock).mockResolvedValueOnce(mockCustomers);

      const result = await getAllCustomerService();
      expect(result).toEqual(mockCustomers);
    });

    it("should return 'No customers found' if database returns empty array", async () => {
      (db.query.CustomerTable.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await getAllCustomerService();
      expect(result).toBe("No customers found");
    });
  });


  //by Id
 describe("getAllCustomersbyIdService", () => {
  it("should return customer with reservations if found", async () => {
    const mockCustomerId = 1;
    const mockCustomer = {
      customerId: 1,
      fullName: "John Doe",
      email: "john@example.com",
      phone: "0712345678",
      address: "123 Main St",
      isVerified: false,
      reservations: [
        {
          bookingId: 1,
          carId: 2,
          rentalStartDate: new Date("2025-06-05"),
          rentalEndDate: new Date("2025-06-10"),
          totalAmount: 15000,
          car: { carId: 2, model: "Toyota" },
          payments: [{ paymentId: 1, amountPaid: 15000 }],
        },
      ],
    };

    // ✅ Correct mock
    (db.query.CustomerTable.findFirst as jest.Mock).mockResolvedValueOnce(mockCustomer);

    const result = await getAllCustomerByIdService(mockCustomerId);

    expect(db.query.CustomerTable.findFirst).toHaveBeenCalled();
    expect(result).toEqual(mockCustomer);
  });

  it("should return 'No customers found' if database returns null", async () => {
    const mockCustomerId = 999;

    // ✅ Return null to simulate not found
    (db.query.CustomerTable.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const result = await getAllCustomerByIdService(mockCustomerId);
    expect(result).toBe("No customers found");
  });
});

  
  //update
  describe("updateCustomerService", () => {
    it("should update the customer and return success message", async () => {
      const mockId = 1;
      const mockCustomer: TICustomer = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "0712345678",
        password: "Mickey4321",
        role: "customer",
        address: "123 Main St",
        verificationCode: "ABC123",
        isVerified: false,
      };

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([mockCustomer]),
          }),
        }),
      });

      const result = await updateCustomerService(mockId, mockCustomer);
      expect(result).toEqual(mockCustomer);
    });
  });


  //delete
    describe("deleteCustomerService", () => {
        it("should delete the customer and return success message", async () => {
        const mockId = 1;
    
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([{ customerId: mockId }]),
            }),
        });
    
        const result = await deleteCustomerService(mockId);
        expect(result).toBe("Customer deleted successfully");
        });
    
        it("should return 'Customer not found' if no customer is deleted", async () => {
        const mockId = 999;
    
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([]),
            }),
        });
    
        const result = await deleteCustomerService(mockId);
        expect(result).toBe("Customer not found");
        });
    });
       




});

// describe("Customer Service Tests", () => {
//   const mockCustomer: TICustomer = {
//     firstName: "John",
//     lastName: "Doe",
//     email: "john@example.com",
//     phone: "0712345678",
//     password: "Mickey4321",
//     role: "customer",
//     address: "123 Main St",
//     verificationCode: "ABC123",
//     isVerified: false,
//   };

//   it("should return the inserted customer if successful", async () => {
//     const insertedCustomer = { customerId: 1, ...mockCustomer };

//     (db.insert as jest.Mock).mockReturnValue({
//       values: jest.fn().mockReturnValue({
//         returning: jest.fn().mockResolvedValueOnce([insertedCustomer]),
//       }),
//     });

//     const result = await createCustomerService(mockCustomer);
//     expect(result).toEqual(insertedCustomer);
//   });

//   it("should return null if insertion fails", async () => {
//     (db.insert as jest.Mock).mockReturnValue({
//       values: jest.fn().mockReturnValue({
//         returning: jest.fn().mockResolvedValueOnce([]),
//       }),
//     });

//     const result = await createCustomerService(mockCustomer);
//     expect(result).toBeNull();
//   });
// });
