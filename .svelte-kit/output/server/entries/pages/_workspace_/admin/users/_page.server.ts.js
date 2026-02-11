import { d as db, u as users } from "../../../../../chunks/db.js";
const load = async () => {
  try {
    const allUsers = await db.select().from(users);
    const usersWithStatus = allUsers.map((user) => ({
      ...user,
      status: "Active"
      // Placeholder until we have a status field
    }));
    return {
      users: usersWithStatus
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      users: []
    };
  }
};
export {
  load
};
