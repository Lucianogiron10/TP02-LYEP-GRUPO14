import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import clienteRoutes from './routes/Cliente.routes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Conectar a MongoDB
try {
  await connectDB();
} catch (error) {
  console.error('No se pudo conectar con MongoDB:', error.message);
  process.exit(1);
}

// Middlewares
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Rutas de la API
app.use('/api/clientes', clienteRoutes);

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API REST de Clientes funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
