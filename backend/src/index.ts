import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./utils/db";

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
