import { Router } from "express";
import mongoose from "mongoose";
import Cliente from "../models/Cliente.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    return res.json(clientes);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "El ID del cliente no es válido." });
  }

  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }
    return res.json(cliente);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const cliente = await Cliente.create(req.body);
    return res.status(201).json(cliente);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "El ID del cliente no es válido." });
  }

  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }
    return res.json(cliente);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "El ID del cliente no es válido." });
  }

  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado." });
    }
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

export default router;
