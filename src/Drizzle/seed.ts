
import  db from "./db"; // my configured database connection
import {
  CarTable,
  CustomerTable,
  LocationTable,
  ReservationTable,
  BookingTable,
  PaymentTable,
  MaintenanceTable,
  InsuranceTable
} from "./schema"; // my schema file

async function seed() {
  // Seed Customers
  await db.insert(CustomerTable).values([
    { firstName: "John", lastName: "Doe", email: "john@example.com", phone: "0712345678", password: "1234567", address: "Nairobi" },
    { firstName: "Jane", lastName: "Smith", email: "jane@example.com", phone: "0723456789", password: "1234567", address: "Mombasa" },
    { firstName: "Ali", lastName: "Khan", email: "ali@example.com", phone: "0734567890", password: "1234567", address: "Kisumu" },
    { firstName: "Grace", lastName: "Wanjiku", email: "grace@example.com", phone: "0745678901", password: "1234567", address: "Nakuru" },
    { firstName: "Brian", lastName: "Otieno", email: "brian@example.com", phone: "0756789012", password: "1234567", address : "Eldoret" },

  ]);

  // Seed Cars
  await db.insert(CarTable).values([
    { carModel: "Toyota Corolla", manufacturer: "Toyota", year: 2020, color: "White", rentalRate: 3000, availability: true },
    { carModel: "Honda Civic", manufacturer: "Honda", year: 2019, color: "Black", rentalRate: 2800, availability: true },
    { carModel: "Mazda Demio", manufacturer: "Mazda", year: 2021, color: "Red", rentalRate: 2500, availability: true },
    { carModel: "Nissan Note", manufacturer: "Nissan", year: 2018, color: "Blue", rentalRate: 2300, availability: false },
    { carModel: "Subaru Impreza", manufacturer: "Subaru", year: 2022, color: "Silver", rentalRate: 3200, availability: true },
  ]);

  // Seed Locations
  await db.insert(LocationTable).values([
    { carId: 1, locationName: "Nairobi CBD", address: "Moi Avenue", contactNumber: "0700112233" },
    { carId: 2, locationName: "Westlands", address: "Ring Road", contactNumber: "0700445566" },
    { carId: 3, locationName: "Thika", address: "Garissa Rd", contactNumber: "0700778899" },
    { carId: 4, locationName: "Kisumu Central", address: "Oginga Odinga St", contactNumber: "0700123456" },
    { carId: 5, locationName: "Mombasa", address: "Moi Ave", contactNumber: "0700654321" },
  ]);

  // Seed Bookings
 await db.insert(BookingTable).values([
    { customerId: 1, carId: 1, rentalStartDate: new Date('2024-06-01'), rentalEndDate: new Date('2024-06-05'), totalAmount: 12000 },
    { customerId: 2, carId: 2, rentalStartDate: new Date('2024-06-10'), rentalEndDate: new Date('2024-06-12'), totalAmount: 5600 },
    { customerId: 3, carId: 3, rentalStartDate: new Date('2024-06-15'), rentalEndDate: new Date('2024-06-20'), totalAmount: 15000 },
    { customerId: 4, carId: 4, rentalStartDate: new Date('2024-07-01'), rentalEndDate: new Date('2024-07-05'), totalAmount: 9200 },
    { customerId: 5, carId: 5, rentalStartDate: new Date('2024-07-10'), rentalEndDate: new Date('2024-07-12'), totalAmount: 6400 },
  ])

  // Seed Payments
  await db.insert(PaymentTable).values([
    { bookingId: 1, paymentDate: new Date(), amount: 12000, paymentMethod: "Mpesa" },
    { bookingId: 2, paymentDate: new Date(), amount: 5600, paymentMethod: "Card" },
    { bookingId: 3, paymentDate: new Date(), amount: 15000, paymentMethod: "Cash" },
    { bookingId: 4, paymentDate: new Date(), amount: 9200, paymentMethod: "Mpesa" },
    { bookingId: 5, paymentDate: new Date(), amount: 6400, paymentMethod: "Card" },
  ]);

  // Seed Maintenance
  await db.insert(MaintenanceTable).values([
    { carId: 1, maintenanceDate: new Date('2024-05-01'), description: "Oil Change", cost: 2000 },
    { carId: 2, maintenanceDate: new Date('2024-05-05'), description: "Brake Pad Replacement", cost: 3500 },
    { carId: 3, maintenanceDate: new Date('2024-05-10'), description: "Tire Rotation", cost: 1500 },
    { carId: 4, maintenanceDate: new Date('2024-05-15'), description: "Engine Check", cost: 5000 },
    { carId: 5, maintenanceDate: new Date('2024-05-20'), description: "Air Filter Replacement", cost: 1000 },
  ]);

  // Seed Insurance
  await db.insert(InsuranceTable).values([
    { carId: 1, provider: "Jubilee", policyNumber: "JUB123", startDate: new Date('2024-01-01'), endDate: new Date('2025-01-01') },
    { carId: 2, provider: "Britam", policyNumber: "BRI456", startDate: new Date('2024-02-01'), endDate: new Date('2025-02-01') },
    { carId: 3, provider: "APA", policyNumber: "APA789", startDate: new Date('2024-03-01'), endDate: new Date('2025-03-01') },
    { carId: 4, provider: "UAP", policyNumber: "UAP321", startDate: new Date('2024-04-01'), endDate: new Date('2025-04-01') },
    { carId: 5, provider: "CIC", policyNumber: "CIC654", startDate: new Date('2024-05-01'), endDate: new Date('2025-05-01') },
  ]);

  // Seed Reservations
  await db.insert(ReservationTable).values([
    { customerId: 1, carId: 1, reservationDate: new Date('2024-05-01'), pickupDate: new Date('2024-06-01'), returnDate: new Date('2024-06-05') },
    { customerId: 2, carId: 2, reservationDate: new Date('2024-05-10'), pickupDate: new Date('2024-06-10'), returnDate: new Date('2024-06-12') },
    { customerId: 3, carId: 3, reservationDate: new Date('2024-05-15'), pickupDate: new Date('2024-06-15'), returnDate: new Date('2024-06-20') },
    { customerId: 4, carId: 4, reservationDate: new Date('2024-06-01'), pickupDate: new Date('2024-07-01'), returnDate: new Date('2024-07-05') },
    { customerId: 5, carId: 5, reservationDate: new Date('2024-06-10'), pickupDate: new Date('2024-07-10'), returnDate: new Date('2024-07-12') },
  ]);

  console.log("Database seeded successfully");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);// 1 means an error occurred
});