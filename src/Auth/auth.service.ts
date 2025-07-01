import { sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { CustomerTable, TICustomer } from "../Drizzle/schema";

//Database
export const createUserService = async (user: TICustomer) => {
    const [createdUser] = await db.insert(CustomerTable).values(user).returning();
    return createdUser;
};


export const getUserByEmailService = async (email: string) => {
    return await db.query.CustomerTable.findFirst({
        where: sql`${CustomerTable.email} = ${email}`
    });
};

export const verifyUserService = async (email: string) => {
    await db.update(CustomerTable)
        .set({ verificationCode: null, isVerified: true })
        .where(sql`${CustomerTable.email} = ${email}`);
};


//login a user
export const userLoginService = async (user: TICustomer) => {
    // email and password
    const { email } = user;

      return await db.query.CustomerTable.findFirst({
        columns: {
            customerId: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            role: true,
            isVerified: true
        }, where: sql`${CustomerTable.email} = ${email} `
    })
}

// fetch all users
export const getAllUsersService = async () => {
    const users = await db.query.CustomerTable.findMany({
        columns: {
            customerId: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            role: true,
            isVerified: true
        }
    });
    return users;
};

// update a user by Id by role either user or admin
export const updateUserService = async (user: TICustomer) => {
    const {role, customerId} = user;
    console.log("Updating user with ID:", customerId, "to role:", role);
    const updatedUser = await db.update(CustomerTable)
        .set({ role })
        .where(sql`${CustomerTable.customerId} = ${customerId}`)
        .returning();

    console.log("Updated User:", updatedUser);
    return updatedUser[0];
}



// delete a user by Id
export const deleteUserService = async (customerId: string) => {
    const deletedUser = await db.delete(CustomerTable)
        .where(sql`${CustomerTable.customerId} = ${customerId}`);
    return deletedUser;
};
