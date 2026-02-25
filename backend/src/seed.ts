import dotenv from "dotenv";
dotenv.config();

import * as authService from "./services/authService";
import { connectDB, disconnectDB } from "./utils/db";

async function run() {
  await connectDB();
  console.log("Connected to MongoDB for seeding");

  const users = [
    {
      name: "Client",
      email: "client@example.com",
      password: "password123",
      role: "client",
    },
    {
      name: "Manager",
      email: "manager@example.com",
      password: "password123",
      role: "manager",
    },
  ];

  for (const u of users) {
    try {
      const existing = await authService.findUserByEmail(u.email);
      if (existing) {
        console.log(`User ${u.email} already exists, skipping.`);
        continue;
      }
      const created = await authService.createUser(u as any);
      console.log(`Created user ${created.email} with role ${created.role}`);
    } catch (err) {
      console.error("Failed to create user", u.email, err);
    }
  }

  await disconnectDB();
  console.log("Seeding complete");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
