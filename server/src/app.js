import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import clientesRoutes from "./routes/clientes.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.disable("x-powered-by");
app.use(cors({
  origin: (origin, callback) => callback(null, !origin || origin === clientOrigin),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.json({ message: "API de clientes", health: "/api/health" });
});

app.get("/api/health", (req, res) => {
  const conectado = mongoose.connection.readyState === 1;
  res.status(conectado ? 200 : 503).json({
    status: conectado ? "ok" : "unavailable",
    database: conectado ? "connected" : "disconnected",
  });
});

app.use("/api/clientes", clientesRoutes);
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada." }));
app.use(errorHandler);

export default app;
