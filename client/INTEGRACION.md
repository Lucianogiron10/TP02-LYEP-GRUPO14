# Integrante C: integracion del frontend

Rama: `feature/Giron-Luciano-Frontend-Integration`.

## Ejecucion

Desde `client/`, ejecutar `npm ci` y `npm run dev`. Vite usa el puerto
5173 y avisa si esta ocupado. La URL predeterminada del backend es
`http://localhost:3001/api`.

Para usar otra URL, crear `client/.env.local` con el contenido de
`.env.example`, modificar `VITE_API_URL` y reiniciar Vite. Esta variable es
publica: no debe contener credenciales ni la URI de MongoDB Atlas.

## Contrato requerido al backend

| Metodo | Ruta | Respuesta exitosa |
| --- | --- | --- |
| GET | `/api/clientes` | Array de clientes |
| GET | `/api/clientes/:id` | Un cliente |
| POST | `/api/clientes` | Cliente creado, incluido `_id` |
| PUT | `/api/clientes/:id` | Cliente actualizado, incluido `_id` |
| DELETE | `/api/clientes/:id` | 200 o 204, cuerpo opcional |

Los clientes siguen el modelo `server/src/models/Cliente.js`: `name.firstname`,
`name.lastname`, `email`, `phone`, `address.city` y los campos opcionales de
direccion y usuario. El servicio convierte `_id` a `id` para las vistas y
los enlaces. El formulario no envia contrasenas. Los errores HTTP pueden
incluir `{ "error": "mensaje" }` o `{ "message": "mensaje" }`.

El servidor debe permitir el origen `http://localhost:5173` y los metodos
GET, POST, PUT, DELETE y OPTIONS, incluido el encabezado Content-Type.

## Cambios y verificacion

- Todas las consultas de clientes usan el servicio centralizado de Axios.
- El alta actualiza el listado inmediatamente con la respuesta del backend.
- La ficha permite editar y eliminar con el rol Gerencia, como el permiso
  existente de eliminacion. Estos controles de interfaz no reemplazan
  la autorizacion del servidor.
- Las solicitudes fallidas muestran errores y las consultas se cancelan
  al abandonar una pantalla.
- La tabla admite desplazamiento horizontal en pantallas pequenas.
- `npm test`: ocho pruebas del servicio contra un servidor HTTP de prueba;
  verifican rutas CRUD, `_id`, errores, respuestas invalidas y cancelacion.
- `npm run build`: compilacion de produccion verificada.
- Prueba de navegador con API simulada: login, listado, alta inmediata,
  consulta, edicion, recarga, borrado 204 y errores 409, 404 y 500.
- ESLint de los archivos JS/JSX modificados: sin errores. El lint general
  tiene cuatro errores previos en App.jsx, AutorizacionesContext.jsx y
  routes.jsx.

## Dependencia pendiente de los integrantes A y B

Al revisar `origin/main` en el commit `038d9d5`, `server/index.js` solo
conecta MongoDB: no inicia Express ni publica rutas. La rama
`feature/Coca-Mauricio-API-REST` en el commit `0a5df60` publica `/api/items`
para productos (`name`, `description`, `price`) y no dispone de GET por id.
Ese contrato no es compatible con las fichas de clientes.

El frontend queda preparado para las rutas de clientes indicadas arriba.
Es necesario que el integrante B las publique usando el modelo Cliente
del integrante A. La persistencia real en Atlas y el CORS del backend del
equipo aun no pudieron verificarse. Las pruebas con API simulada no
acreditan esos puntos ni implementan un backend de reemplazo.

## Uso de IA

Se utilizo OpenAI Codex para revisar el repositorio, implementar la
integracion, generar pruebas y ejecutar verificaciones. Se contrastaron
los cambios con el modelo Cliente y se revisaron los resultados del build,
las pruebas HTTP, ESLint y los flujos de navegador. Queda pendiente la
validacion del equipo con la API real y MongoDB Atlas.
