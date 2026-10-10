# Backend: conexión y modelo

## Configuración

1. Desde `server/`, instala las dependencias con `npm install`.
2. Copia `.env.example` como `.env`.
3. Sustituye `MONGODB_URI` por la URI de MongoDB Atlas con las credenciales vigentes. No compartas ni subas ese archivo.
4. En Atlas, permite la conexión desde la IP de desarrollo y confirma que el usuario tenga permisos sobre la base de datos.

## Ejecución

- `npm start`: conecta con MongoDB e inicia la API en `http://localhost:3001`.
- `npm run dev`: inicia la API y reinicia el proceso ante cambios.

La API expone operaciones CRUD en `/api/clientes`: `GET` lista o consulta un cliente, `POST` crea, `PUT` actualiza y `DELETE` elimina. El modelo `Cliente` conserva los campos de nombre, email, teléfono, usuario y dirección que utiliza la interfaz. No almacena contraseñas.
