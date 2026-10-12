# TP02 LyEP - Grupo 14

Panel de gestion de clientes con React y Vite, API REST con Express y
persistencia en MongoDB Atlas. Corresponde al punto 4, Tecnica, del TP N2.

## Requisitos

- Node.js 22.12 o posterior y npm.
- Git.
- Cluster de MongoDB Atlas con usuario de base de datos, permisos sobre la
  base elegida e IP de desarrollo habilitada en Network Access.

## Instalacion y ejecucion local

Desde la raiz del repositorio, abrir dos terminales. Las copias de archivos
de los ejemplos siguientes usan PowerShell.

### Terminal 1: backend

```powershell
cd server
npm ci
Copy-Item .env.example .env
```

En `server/.env`, completar MONGODB_URI con la conexion de Atlas del grupo.
No dejar los placeholders y no publicar credenciales. Si el archivo ya
existe, conservarlo en lugar de sobrescribirlo. Luego ejecutar:

```powershell
npm run dev
```

El servidor debe confirmar la conexion a MongoDB y responder en
`http://localhost:3001/`. Si la conexion falla, se detiene: el mensaje de
inicio HTTP por si solo no acredita la persistencia.

### Terminal 2: frontend

```powershell
cd client
npm ci
npm run dev
```

Abrir `http://localhost:5173`. El servicio usa por defecto
`http://localhost:3001/api`. Para cambiarlo, crear `client/.env.local`
usando `.env.example`, ajustar VITE_API_URL y reiniciar Vite.

Credenciales de demostracion del prototipo:

| Email | Contrasena | Sector |
| --- | --- | --- |
| jimena@gmail.com | Admin123 | Gerencia |
| antonella@gmail.com | Admin123 | Soporte |

Gerencia puede consultar, crear, editar y eliminar clientes. El login y
los permisos actuales se implementan en el frontend; no constituyen
autenticacion del servidor para un despliegue publico.

## Variables de entorno

| Archivo | Variable | Uso |
| --- | --- | --- |
| server/.env | MONGODB_URI | URI privada de MongoDB Atlas |
| server/.env | PORT | Puerto HTTP, por defecto 3001 |
| server/.env | CLIENT_ORIGIN | Origen permitido por CORS, por defecto http://localhost:5173 |
| server/.env | NODE_ENV | production para la ejecucion de produccion |
| client/.env.local o client/.env.production | VITE_API_URL | URL publica de la API, incluido /api |

Los valores VITE_ quedan incluidos en el navegador: nunca deben contener
la URI de MongoDB ni contrasenas. Los archivos .env con valores reales
estan excluidos de Git. Los archivos de ejemplo contienen placeholders.

Si una credencial ya fue publicada, eliminarla del ejemplo no la borra
del historial: cambiar la contrasena del usuario de Atlas y actualizar el
.env privado antes de compartir o entregar el proyecto.

## API REST

| Metodo | Endpoint | Respuesta exitosa |
| --- | --- | --- |
| GET | / | Identificacion del servidor |
| GET | /api/clientes | Array de clientes |
| GET | /api/clientes/:id | Cliente solicitado |
| POST | /api/clientes | 201 y cliente creado |
| PUT | /api/clientes/:id | Cliente actualizado |
| DELETE | /api/clientes/:id | Confirmacion de eliminacion |

Los ids son ObjectId de MongoDB. Los datos usan name.firstname,
name.lastname, email, phone, address.city y los campos opcionales de
direccion y username. El servicio del frontend adapta _id a id.

## Verificacion

Desde client:

```powershell
npm test
npm run build
npm run lint
```

Las ocho pruebas existentes del servicio usan un servidor de prueba, no
Atlas. El build genera client/dist. El lint tiene errores previos
registrados en [la revision de entrega](docs/entrega-tecnica.md).

Para verificar persistencia real, ejecutar los casos CRUD del
[integrante D](docs/test-cases.md), recargar la interfaz y reiniciar el
backend entre edicion y consulta. Contrastar en Atlas el alta, los cambios
y la baja del mismo cliente de prueba. Una matriz marcada como aprobada
no sustituye la evidencia de esa ejecucion.

## Configuracion de produccion

El alcance de la consigna exige ejecucion local en 5173 y 3001. Se dejan
plantillas para un eventual despliegue; no se publico un servicio en la nube.

1. En el backend, usar server/.env.production.example como base del .env
   privado o definir esas variables en el proveedor. Configurar Atlas,
   CLIENT_ORIGIN con el origen HTTPS real del frontend y ejecutar npm ci
   --omit=dev y npm start desde server.
2. En el frontend, usar client/.env.production.example como base de
   client/.env.production. Configurar VITE_API_URL con la URL HTTPS real
   de la API antes de ejecutar npm ci y npm run build.
3. Publicar client/dist en un servidor estatico con redireccion de rutas
   desconocidas a index.html para que funcionen /clientes y /clientes/:id.
4. Para inspeccionar el build local, ejecutar npm run preview -- --port
   5173 desde client, con la API local configurada y el servidor de Vite
   de desarrollo detenido. preview no es un servidor de produccion.

## Ramas y pull requests

- Cada integrante trabaja en feature/Apellido-Nombre-Tarea y sube su rama.
- Realizar al menos dos commits semanticos descriptivos por integrante.
- Abrir PR hacia main con que cambia, como funciona, archivos modificados,
  verificaciones y declaratoria de IA: herramienta, asistencia y evaluacion.
- Revisar la descripcion y el codigo antes de integrar. No hacer push
  directo a main ni abrir o cerrar PR sin descripcion completa.
- La [plantilla de PR](.github/pull_request_template.md) facilita esos datos.

La revision de las ramas, PR y pruebas actuales se encuentra en
[docs/entrega-tecnica.md](docs/entrega-tecnica.md).

## Licencias

Codigo bajo MIT. Documentacion y material pedagogico bajo Creative Commons
Attribution 4.0, conforme a las condiciones del proyecto original.
