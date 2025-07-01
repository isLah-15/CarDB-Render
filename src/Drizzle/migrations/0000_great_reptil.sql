CREATE TABLE "Booking" (
	"Booking ID" serial PRIMARY KEY NOT NULL,
	"Customer ID" integer NOT NULL,
	"Car ID" integer NOT NULL,
	"Rental Start Date" timestamp NOT NULL,
	"Rental End Date" timestamp NOT NULL,
	"Total Amount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Car" (
	"Car ID" serial PRIMARY KEY NOT NULL,
	"Car Model" varchar NOT NULL,
	"Manufacturer" varchar NOT NULL,
	"Year" integer NOT NULL,
	"Color" varchar NOT NULL,
	"Rental Rate" integer NOT NULL,
	"Availability" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Customer" (
	"Customer ID" serial PRIMARY KEY NOT NULL,
	"First Name" text NOT NULL,
	"Last Name" text NOT NULL,
	"Email" varchar NOT NULL,
	"Phone" text NOT NULL,
	"Password" varchar NOT NULL,
	"Role" varchar DEFAULT 'customer',
	"Address" text NOT NULL,
	"Verification Code" varchar,
	"Is Verified" boolean DEFAULT false,
	CONSTRAINT "Customer_Email_unique" UNIQUE("Email")
);
--> statement-breakpoint
CREATE TABLE "Insurance" (
	"Insurance ID" serial PRIMARY KEY NOT NULL,
	"Car ID" integer NOT NULL,
	"Provider" varchar NOT NULL,
	"Policy Number" varchar NOT NULL,
	"Start Date" timestamp NOT NULL,
	"End Date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Location" (
	"Location ID" serial PRIMARY KEY NOT NULL,
	"Car ID" integer NOT NULL,
	"Location Name" varchar NOT NULL,
	"Address" text NOT NULL,
	"Contact Number" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Maintenance" (
	"Maintenance ID" serial PRIMARY KEY NOT NULL,
	"Car ID" integer NOT NULL,
	"Maintenance Date" timestamp NOT NULL,
	"Description" text NOT NULL,
	"Cost" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Payment" (
	"Payment ID" serial PRIMARY KEY NOT NULL,
	"Booking ID" integer NOT NULL,
	"Payment Date" timestamp NOT NULL,
	"Amount" integer NOT NULL,
	"Payment Method" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Reservation" (
	"Reservation ID" serial PRIMARY KEY NOT NULL,
	"Customer ID" integer NOT NULL,
	"Car ID" integer NOT NULL,
	"Reservation Date" timestamp NOT NULL,
	"Pickup Date" timestamp NOT NULL,
	"Return Date" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_Customer ID_Customer_Customer ID_fk" FOREIGN KEY ("Customer ID") REFERENCES "public"."Customer"("Customer ID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_Car ID_Car_Car ID_fk" FOREIGN KEY ("Car ID") REFERENCES "public"."Car"("Car ID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Insurance" ADD CONSTRAINT "Insurance_Car ID_Car_Car ID_fk" FOREIGN KEY ("Car ID") REFERENCES "public"."Car"("Car ID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Location" ADD CONSTRAINT "Location_Car ID_Car_Car ID_fk" FOREIGN KEY ("Car ID") REFERENCES "public"."Car"("Car ID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_Car ID_Car_Car ID_fk" FOREIGN KEY ("Car ID") REFERENCES "public"."Car"("Car ID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_Booking ID_Booking_Booking ID_fk" FOREIGN KEY ("Booking ID") REFERENCES "public"."Booking"("Booking ID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_Customer ID_Customer_Customer ID_fk" FOREIGN KEY ("Customer ID") REFERENCES "public"."Customer"("Customer ID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_Car ID_Car_Car ID_fk" FOREIGN KEY ("Car ID") REFERENCES "public"."Car"("Car ID") ON DELETE cascade ON UPDATE no action;