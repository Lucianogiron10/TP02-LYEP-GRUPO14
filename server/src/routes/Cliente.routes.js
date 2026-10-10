import express from 'express';
import {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
} from '../controllers/Cliente.controller.js';

const router = express.Router();

// Rutas para la API de Clientes
router.get('/', getClientes);
router.get('/:id', getClienteById); // Ruta para obtener un único cliente por ID
router.post('/', createCliente);
router.put('/:id', updateCliente);
router.delete('/:id', deleteCliente);

export default router;