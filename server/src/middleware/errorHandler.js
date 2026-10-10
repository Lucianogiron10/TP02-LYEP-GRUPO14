import mongoose from "mongoose";

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error.code === 11000) {
    return res.status(409).json({ error: "Ya existe un cliente con ese email." });
  }
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: "Datos del cliente invalidos.",
      details: Object.values(error.errors).map((detalle) => ({ field: detalle.path, message: detalle.message })),
    });
  }
  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: "Datos del cliente invalidos." });
  }
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El cuerpo no contiene JSON valido." });
  }
  if (error.status === 413) {
    return res.status(413).json({ error: "El cuerpo de la solicitud es demasiado grande." });
  }
  if (error.status === 400) {
    return res.status(400).json({ error: error.message });
  }

  console.error("Error interno en la API:", error.name);
  res.status(500).json({ error: "Error interno del servidor." });
};

export default errorHandler;
