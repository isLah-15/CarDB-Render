

import { relations } from "drizzle-orm";
import { serial, boolean, timestamp, integer, pgTable, text, varchar  } from "drizzle-orm/pg-core";

//customer table
export const CustomerTable = pgTable("Customer", {
    customerId: serial("Customer ID").primaryKey(),
    firstName: text("First Name").notNull(),
    lastName: text("Last Name").notNull(),
    email: varchar("Email").notNull().unique(),
    phone: text("Phone").notNull(),
    password: varchar("Password").notNull(),
    role: varchar("Role").default("customer"),
    address: text("Address").notNull(),
    verificationCode: varchar("Verification Code"),
    isVerified: boolean("Is Verified").default(false)
});


//location table
export const LocationTable = pgTable("Location", {
    locationId: serial("Location ID").primaryKey(),
    carId: integer("Car ID").notNull().references(() => CarTable.carId, {onDelete: "cascade"}),
    locationName: varchar("Location Name").notNull(),
    address: text("Address").notNull(),
    contactNumber: text("Contact Number").notNull(),
});

//car table
export const CarTable = pgTable("Car", {
    carId: serial("Car ID").primaryKey(),
    carModel: varchar("Car Model").notNull(),
    manufacturer: varchar("Manufacturer").notNull(),
    year: integer("Year").notNull(),
    color: varchar("Color").notNull(),
    rentalRate: integer("Rental Rate").notNull(),
    availability: boolean("Availability").notNull(),
});

//reservation table
export const ReservationTable = pgTable("Reservation", {
    reservationId: serial("Reservation ID").primaryKey(),
    customerId: integer("Customer ID").notNull().references(() => CustomerTable.customerId, {onDelete: "cascade"}),
    carId: integer("Car ID").notNull().references(() => CarTable.carId, {onDelete: "cascade"}),
    reservationDate: timestamp("Reservation Date").notNull(),
    pickupDate: timestamp("Pickup Date").notNull(),
    returnDate: timestamp("Return Date").notNull(),
});

//booking table
export const BookingTable = pgTable("Booking", {
    bookingId: serial("Booking ID").primaryKey(),
    customerId: integer("Customer ID").notNull().references(() => CustomerTable.customerId, {onDelete: "cascade"}),
    carId: integer("Car ID").notNull().references(() => CarTable.carId, {onDelete: "cascade"}),
    rentalStartDate: timestamp("Rental Start Date").notNull(),
    rentalEndDate: timestamp("Rental End Date").notNull(),
    totalAmount: integer("Total Amount").notNull(),
});

//payment table
export const PaymentTable = pgTable("Payment", {
    paymentId: serial("Payment ID").primaryKey(),
    bookingId: integer("Booking ID").notNull().references(() => BookingTable.bookingId, {onDelete: "cascade"}),
    paymentDate: timestamp("Payment Date").notNull(),
    amount: integer("Amount").notNull(),
    paymentMethod: varchar("Payment Method").notNull(),
});

//maintenance table
export const MaintenanceTable = pgTable("Maintenance", {
    maintenanceId: serial("Maintenance ID").primaryKey(),
    carId: integer("Car ID").notNull().references(() => CarTable.carId, {onDelete: "cascade"}),
    maintenanceDate: timestamp("Maintenance Date").notNull(),
    description: text("Description").notNull(),
    cost: integer("Cost").notNull(),
});

//insurance table
export const InsuranceTable = pgTable("Insurance", {
    insuranceId: serial("Insurance ID").primaryKey(),
    carId: integer("Car ID").notNull().references(() => CarTable.carId, {onDelete: "cascade"}),
    provider: varchar("Provider").notNull(),
    policyNumber: varchar("Policy Number").notNull(),
    startDate: timestamp("Start Date").notNull(),
    endDate: timestamp("End Date").notNull(),
});


//RELATIONSHIPS

//CustomerTable Relationships - 1 customer can have many reservations
export const CustomerRelations = relations(CustomerTable, ({many}) => ({
    reservations: many(ReservationTable),
    bookings: many(BookingTable),
}));

//LocationTable Relationships - 1 location can have many cars
export const LocationRelations = relations(LocationTable, ({many}) => ({
    cars: many(CarTable),
}));

//CarTable Relationships - 1 car can have many reservations, bookings, maintenance, and insurance
export const CarRelations = relations(CarTable, ({many, one}) => ({
    location: one(LocationTable, {
        fields: [CarTable.carId],
        references: [LocationTable.carId],
    }),

    reservations: many(ReservationTable),
    bookings: many(BookingTable),
    maintenance: many(MaintenanceTable),
    insurance: many(InsuranceTable),
}));

//ReservationTable Relationships - 1 reservation belongs to 1 customer and 1 car
export const ReservationRelations = relations(ReservationTable, ({one}) => ({
    customer: one(CustomerTable, {
        fields: [ReservationTable.customerId],
        references: [CustomerTable.customerId],
    }),
    car: one(CarTable, {
        fields: [ReservationTable.carId],
        references: [CarTable.carId],
    }),
}));

//BookingTable Relationships - 1 booking belongs to 1 customer and 1 car, and can have many payments
export const BookingRelations = relations(BookingTable, ({one, many}) => ({
    customer: one(CustomerTable, {
        fields: [BookingTable.customerId],
        references: [CustomerTable.customerId],
    }),
    car: one(CarTable, {
        fields: [BookingTable.carId],
        references: [CarTable.carId],
    }),
    payments: many(PaymentTable),
}));

//PaymentTable Relationships - 1 payment belongs to 1 booking
export const PaymentRelations = relations(PaymentTable, ({one}) => ({
    booking: one(BookingTable, {
        fields: [PaymentTable.bookingId],
        references: [BookingTable.bookingId],
    }),
}));

//MaintenanceTable Relationships - 1 maintenance record belongs to 1 car
export const MaintenanceRelations = relations(MaintenanceTable, ({one}) => ({
    car: one(CarTable, {
        fields: [MaintenanceTable.carId],
        references: [CarTable.carId],
    }),
}));

//InsuranceTable Relationships - 1 insurance policy belongs to 1 car
export const InsuranceRelations = relations(InsuranceTable, ({one}) => ({
    car: one(CarTable, {
        fields: [InsuranceTable.carId],
        references: [CarTable.carId],
    }),
}))


// types for the tables
export type TICustomer = typeof CustomerTable.$inferInsert;
export type TSCustomer = typeof CustomerTable.$inferSelect;

export type TILocation = typeof LocationTable.$inferInsert;
export type TSLocation = typeof LocationTable.$inferSelect;

export type TICar = typeof CarTable.$inferInsert;
export type TSCar = typeof CarTable.$inferSelect;

export type TIReservation = typeof ReservationTable.$inferInsert;
export type TSReservation = typeof ReservationTable.$inferSelect;

export type TIPayment = typeof PaymentTable.$inferInsert;
export type TSPayment = typeof PaymentTable.$inferSelect;

export type TIMaintenance = typeof MaintenanceTable.$inferInsert;
export type TSMaintenance = typeof MaintenanceTable.$inferSelect;

export type TIInsurance = typeof InsuranceTable.$inferInsert;
export type TSInsurance = typeof InsuranceTable.$inferSelect;

export type TIBooking = typeof BookingTable.$inferInsert;
export type TSBooking = typeof BookingTable.$inferSelect;