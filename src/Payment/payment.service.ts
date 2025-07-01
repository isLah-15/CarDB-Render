import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { BookingTable, PaymentTable, TIPayment } from "../Drizzle/schema";


// create payment service
export const createPaymentService = async (payment: TIPayment) => {
    const [inserted] = await db.insert(PaymentTable).values(payment).returning()
        if(inserted) {
            return inserted;
        }
        return null;
};

// Get all payments with booking details
export const getAllPaymentService = async () => {
  const payments = await db.query.PaymentTable.findMany({
    with: {
      booking: true, // assumes `booking` is defined in relations for PaymentTable
    },
  });

  if (!payments || payments.length === 0) {
    return "No payments found";
  }

  return payments;
};

// Get a payment by ID with booking details
export const getPaymentById = async (paymentId: number) => {
  const payment = await db.query.PaymentTable.findFirst({
    where: eq(PaymentTable.paymentId, paymentId),
    with: {
      booking: true,
    },
  });

  if (!payment) {
    return "Payment not found";
  }

  return payment;
};

//update payment service
export const updatePaymentService = async (id: number, payment: TIPayment) => {
    await db.update(PaymentTable).set(payment).where(eq(PaymentTable.paymentId, id)).returning();
    return "Payment update successfully";

};

//delete payment service
export const deletePaymentService = async (id: number) => {
    const deleted = await db.delete(PaymentTable).where(eq(PaymentTable.paymentId, id)).returning();
    if (deleted.length === 0) {
        return "Payment not found";
    }
    return "Payment deleted successfully";
};
