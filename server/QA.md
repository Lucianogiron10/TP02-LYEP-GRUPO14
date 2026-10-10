# Verificacion para el integrante D

## Requisitos

- Usar la rama `feature/Giron-Luciano-Backend-Integration` o el main que
  incorpore su PR y el frontend del integrante C.
- Configurar `server/.env` con la URI real de Atlas, PORT=3001 y
  CLIENT_ORIGIN=http://localhost:5173. No publicar ese archivo.
- Permitir la IP de desarrollo en Atlas y los permisos del usuario sobre
  la base elegida. Utilizar datos de prueba identificables.
- Instalar con `npm ci` en server y client. Ejecutar `npm run dev` en
  ambas carpetas, en terminales distintas.
- Abrir `http://localhost:3001/api/health`: debe indicar connected.

## Casos manuales con Atlas

| Caso | Accion | Resultado esperado |
| --- | --- | --- |
| Alta | Iniciar sesion como Gerencia y crear un cliente con email de prueba unico | Mensaje de exito, fila visible inmediatamente y documento en la coleccion clientes de Atlas |
| Lectura | Recargar el listado y abrir la ficha | Mismos datos e identificador que en Atlas |
| Edicion | Editar ciudad, telefono o nombre desde la ficha | Datos actualizados en ficha, listado tras recargar y Atlas |
| Persistencia | Reiniciar el backend y volver a consultar | El cliente sigue existiendo con los cambios |
| Duplicado | Crear otro cliente con el mismo email | HTTP 409, error visible y sin documento adicional |
| Validacion | Omitir apellido o enviar email invalido; probar POST invalido con Postman | El formulario o la API rechaza los datos; API responde 400 |
| Id invalido | Consultar /api/clientes/id-invalido | HTTP 400 con error JSON |
| Inexistente | Consultar un ObjectId valido que no exista | HTTP 404 y sin pantalla de carga infinita |
| Baja | Eliminar el cliente de prueba desde la ficha | HTTP 204, regreso al listado y documento ausente en Atlas |
| CORS | Inspeccionar Network y Console al crear, editar y borrar | Sin errores CORS; OPTIONS permite el origen localhost:5173 y el metodo solicitado |
| Sin backend | Detener el backend e intentar consultar desde la interfaz | Error visible, sin bloqueo permanente de la pantalla |
| Soporte | Iniciar sesion con sector Soporte y abrir una ficha | Puede consultar; no aparecen los botones de edicion y eliminacion |

El login de Gerencia existente usa jimena@gmail.com / Admin123 / Gerencia.
El login de Soporte usa antonella@gmail.com / Admin123 / Soporte.
Los permisos visuales no prueban autorizacion del backend: el prototipo
actual no implementa autenticacion del servidor.

## Pruebas automatizadas

Desde server: `npm test`. Ejecuta trece casos de API y arranque, con MongoDB
temporal para el CRUD real, persistencia tras reconectar y preflight CORS. No
acredita la conexion a Atlas. Desde client: `npm test` y `npm run build`.

## Evidencia de la prueba del grupo

Registrar fecha, rama/commit, responsable, caso, resultado real, estado
(aprobado/fallido) y evidencia. Para persistencia adjuntar capturas del
documento en Atlas despues del alta y la edicion, y de su ausencia despues
de la baja. No incluir contrasenas ni la URI completa en las capturas.
Marcar los casos como pendientes hasta ejecutarlos contra Atlas.

## Verificacion local de esta correccion

El 10/10/2026 se ejecutaron y aprobaron las trece pruebas automatizadas
del backend y el build del frontend. Ademas se probo en Chrome la interfaz
con este backend y MongoDB temporal: alta, consulta, edicion, reinicio de
la API, consulta de los cambios persistidos y baja. Se contrastaron el
alta, la edicion y la baja con documentos consultados mediante Mongoose.
No se observaron errores de JavaScript ni CORS en ese recorrido.

Esta evidencia corresponde a MongoDB local temporal. Los casos contra
Atlas de la tabla anterior siguen pendientes hasta configurar la conexion
del grupo y ejecutarlos.

## Declaratoria de uso de IA

Herramienta: OpenAI Codex. Asistencia: integracion de Express con el modelo
Cliente existente, validaciones, CORS, pruebas y documentacion. Evaluacion:
se ejecutaron las pruebas HTTP con MongoDB real temporal, el flujo de
navegador y el build; falta la evaluacion del integrante D con Atlas.
