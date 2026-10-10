import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

const connectDB = async () => {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error("Falta definir MONGODB_URI en server/.env");
  }

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.info(`MongoDB conectado: ${mongoose.connection.name}`);

  return mongoose.connection;
};

export default connectDB;
