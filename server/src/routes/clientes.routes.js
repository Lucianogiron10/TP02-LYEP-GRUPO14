import { Router } from "express";
import mongoose from "mongoose";
import {
  obtenerClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from "../controllers/clientes.controller.js";

const router = Router();

router.param("id", (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ error: "Identificador de cliente invalido." });
  }
  next();
});

router.route("/").get(obtenerClientes).post(crearCliente);
router.route("/:id").get(obtenerCliente).put(actualizarCliente).delete(eliminarCliente);

export default router;
