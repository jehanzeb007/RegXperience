import mongoose from "mongoose";

const DEFAULT_URI = "mongodb://localhost:27017/regxperience";

export async function connectDB(uri?: string) {
  const mongoUri = uri ?? process.env.MONGO_URI ?? DEFAULT_URI;

  const { readyState } = mongoose.connection;

  // 1 = connected
  if (readyState === 1) return mongoose;

  // 2 = connecting → wait
  if (readyState === 2) {
    await new Promise<void>((resolve, reject) => {
      mongoose.connection.once("connected", resolve);
      mongoose.connection.once("error", reject);
    });
    return mongoose;
  }

  // 0 = disconnected | 3 = disconnecting
  await mongoose.connect(mongoUri);
  return mongoose;
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

export default { connectDB, disconnectDB };
