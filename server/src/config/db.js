import "dotenv/config";
import mongoose from "mongoose";

const connectDB = async () => {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error("Falta definir MONGODB_URI en server/.env");
  }

  await mongoose.connect(MONGODB_URI);
  console.info(`MongoDB conectado: ${mongoose.connection.name}`);

  return mongoose.connection;
};

export default connectDB;