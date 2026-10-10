import cors from "cors";
import express from "express";
import connectDB from "./src/config/db.js";
import clientesRouter from "./src/routes/clientes.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api/clientes", clientesRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

app.use((error, _req, res, _next) => {
  if (error.code === 11000) {
    return res.status(409).json({ error: "Ya existe un cliente con ese email." });
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ error: error.message });
  }

  console.error("Error interno de la API:", error);
  return res.status(500).json({ error: "Error interno del servidor." });
});

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.info(`API disponible en http://localhost:${port}`);
  }).on("error", (error) => {
    console.error("No se pudo iniciar la API:", error.message);
    process.exitCode = 1;
  });
};

startServer().catch((error) => {
  console.error("No se pudo conectar con MongoDB:", error.message);
  process.exitCode = 1;
});