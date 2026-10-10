const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const itemRoutes = require('./routes/item.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API REST completa funcionando en el puerto 3001' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});