# Backend: API de clientes y MongoDB

## Configuración

1. Desde `server/`, instala las dependencias con `npm ci`.
2. Copia `.env.example` como `.env`.
3. Sustituye `MONGODB_URI` por la URI de MongoDB Atlas con las credenciales vigentes. No compartas ni subas ese archivo.
4. En Atlas, permite la conexión desde la IP de desarrollo y confirma que el usuario tenga permisos sobre la base de datos.
5. Conserva `PORT=3001` y `CLIENT_ORIGIN=http://localhost:5173` para el frontend local.

## Ejecución

- `npm start`: conecta a MongoDB, inicializa el indice unico de email y arranca Express.
- `npm run dev`: hace lo mismo y reinicia el proceso ante cambios.
- `npm test`: ejecuta pruebas HTTP y CRUD con MongoDB temporal; no usa Atlas.

El punto de entrada es `src/index.js`; `index.js` conserva la compatibilidad
con los comandos existentes. La configuracion se lee de `server/.env`,
incluso si se ejecuta `node server/index.js` desde la raiz del repositorio.
Si falta la URI o no se puede conectar, el servidor termina con un error;
no responde con datos simulados. MongoDB dispone de 10 segundos para
seleccionar un servidor al conectar.

## Endpoints

| Metodo | Ruta | Resultado |
| --- | --- | --- |
| GET | `/` | Identificacion de la API |
| GET | `/api/health` | 200 si MongoDB esta conectado; 503 si no |
| GET | `/api/clientes` | Array de clientes, posiblemente vacio |
| GET | `/api/clientes/:id` | Documento de un cliente |
| POST | `/api/clientes` | 201 y documento creado |
| PUT | `/api/clientes/:id` | 200 y documento actualizado |
| DELETE | `/api/clientes/:id` | 204 sin cuerpo |

Las rutas con id usan el `_id` de MongoDB. Los cuerpos de alta y edicion
aceptan `name`, `email`, `phone`, `address` y `username`. PUT permite cambiar
solo algunos campos; al enviar `name` o `address`, se debe enviar ese
objeto completo para conservar sus campos. El formulario del frontend
envia los objetos completos y conserva los datos de direccion.

Ejemplo de alta:

```json
{
  "name": { "firstname": "Luciano", "lastname": "Giron" },
  "email": "cliente-prueba@example.com",
  "phone": "3881234567",
  "address": { "city": "Jujuy" },
  "username": "luciano"
}
```

Los errores son JSON con `error` y, para validaciones del modelo, `details`.
Se responde 400 ante datos o ids invalidos, 404 si el cliente no existe,
409 ante un email duplicado y 500 ante errores internos. No se aceptan
operadores de actualizacion enviados como campos del cuerpo.

## Integracion y pruebas

En otra terminal, desde `client/`, ejecutar `npm ci` y `npm run dev`.
Abrir `http://localhost:5173`. El frontend ya usa esta API por defecto.
La API permite CORS para `CLIENT_ORIGIN`, incluido el preflight de PUT y
DELETE con Content-Type JSON. CORS no reemplaza la autenticacion: el login
y los roles actuales pertenecen al prototipo de frontend.

Las pruebas utilizan una instancia real de MongoDB creada por
`mongodb-memory-server` y eliminada al terminar. La primera ejecucion
puede descargar el binario de MongoDB; requiere acceso a internet.
La URI de pruebas se genera dentro del test y nunca se toma de `.env`.
Incluyen persistencia tras reconectar Mongoose, CRUD, validaciones,
duplicados, ids invalidos, JSON mal formado y CORS.

La validacion especifica con Atlas corresponde al flujo de `QA.md` y
requiere las credenciales e IP autorizada del grupo.

El modelo `Cliente` conserva los campos de nombre, email, teléfono, usuario y dirección que utiliza la interfaz. No almacena contraseñas.
