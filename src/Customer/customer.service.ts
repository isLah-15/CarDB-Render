
import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { CustomerTable, ReservationTable, TICustomer } from "../Drizzle/schema";



// create customer service
export const createCustomerService = async (customer: TICustomer) => {
    const [inserted] = await db.insert(CustomerTable).values(customer).returning()
        if(inserted) {
            return inserted;
        }
        return null;
};

//get all customer service with reservation details
export const getAllCustomerService = async () => {
  const customers = await db.query.CustomerTable.findMany({
    with: {
      reservations: true,
    },
  });

  if (customers.length === 0) {
    return "No customers found";
  }

  return customers;
};

//get all customer id with reservations
export const getAllCustomerByIdService = async (customerId: number) => {
  const customer = await db.query.CustomerTable.findFirst({
    where: eq(CustomerTable.customerId, customerId),
    with: {
      reservations: true,
    },
  });

  if (!customer) {
    return "No customers found";
  }

  return customer;
};


// Update a customer service
export const updateCustomerService = async (id: number, customer: TICustomer) => {
    const [updated] = await db
        .update(CustomerTable)
        .set(customer)
        .where(eq(CustomerTable.customerId, id))
        .returning(); // This ensures the updated row is returned

    return updated; // Return the actual updated customer
};

//delete customer service
export const deleteCustomerService = async (id: number) => {
    const deleted = await db.delete(CustomerTable).where(eq(CustomerTable.customerId, id)).returning();
    if (deleted.length === 0) {
        return "Customer not found";
    }
    return "Customer deleted successfully";
};


