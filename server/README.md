# Backend: API REST y MongoDB Atlas

## Configuración

1. Desde `server/`, instala las dependencias con `npm install`.
2. Copia `.env.example` como `.env`.
3. Sustituye `MONGODB_URI` por la URI de MongoDB Atlas con las credenciales vigentes. No compartas ni subas ese archivo.
4. En Atlas, permite la conexión desde la IP de desarrollo y confirma que el usuario tenga permisos sobre la base de datos.

## Ejecución

- `npm start`: conecta MongoDB e inicia Express en el puerto 3001.
- `npm run dev`: hace lo mismo y reinicia el proceso ante cambios.

El punto de entrada es `src/index.js`. Ejecutar los comandos desde server/
para que dotenv lea server/.env. PORT configura el puerto y CLIENT_ORIGIN
el origen CORS, por defecto http://localhost:5173. Si MongoDB no conecta,
el proceso termina con error.

La API publica GET/POST /api/clientes y GET/PUT/DELETE /api/clientes/:id.
La configuracion completa y la ejecucion del frontend estan en el
[README general](../README.md).

El modelo `Cliente` conserva los campos de nombre, email, teléfono, usuario y dirección que utiliza la interfaz. No almacena contraseñas.
