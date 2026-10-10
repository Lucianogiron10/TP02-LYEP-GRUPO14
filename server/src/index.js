import connectDB from "./config/db.js";
import mongoose from "mongoose";
import app from "./app.js";
import Cliente from "./models/Cliente.js";

try {
  const port = Number(process.env.PORT || 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT debe ser un puerto valido entre 1 y 65535.");
  }

  await connectDB();
  // Crear el indice unico antes de aceptar altas con emails duplicados.
  await Cliente.init();

  const server = app.listen(port, () => {
    console.info(`API de clientes disponible en http://localhost:${port}`);
  });

  server.on("error", async (error) => {
    console.error("No se pudo iniciar la API:", error.message);
    await mongoose.disconnect();
    process.exitCode = 1;
  });

  const cerrarServidor = () => {
    server.close(async () => {
      await mongoose.disconnect();
    });
  };
  process.once("SIGINT", cerrarServidor);
  process.once("SIGTERM", cerrarServidor);
} catch (error) {
  console.error("No se pudo iniciar el servidor:", error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
}
