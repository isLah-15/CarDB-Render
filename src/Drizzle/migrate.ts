import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator"; 

import db, { client } from "./db"; // Import the db and client from your db.ts file

async function migration () {
    console.log("...Starting migration...");
    await migrate(db, { migrationsFolder: __dirname + "/migrations" });
    await client.end();
    console.log("...Migration completed and client connection closed."); 
    process.exit(0); // Exit the process after migration   
}

migration().catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1); // Exit the process with an error code
});