import connectDB from "./src/config/db.js";

try {
  await connectDB();
} catch (error) {
  console.error("No se pudo conectar con MongoDB:", error.message);
  process.exitCode = 1;
}