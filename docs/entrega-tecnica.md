# Revision de entrega: punto 4, Tecnica

Revision del 11/10/2026 sobre main 87c92f7 y la rama
feature/Giron-Luciano-Documentacion-Deploy. Alcance: integrante E,
documentacion, configuracion de despliegue y revision de PR. Fuente de
requisitos: TP-N2-LYEP-GRUPO14.pdf, punto 4, paginas 11 y 12.

## Verificaciones independientes

| Control | Resultado |
| --- | --- |
| Estructura client/ y server/ | Existe y separa frontend de backend |
| API propia | GET/POST /api/clientes y GET/PUT/DELETE /api/clientes/:id; no quedan llamadas a FakeStoreAPI en client/src |
| Build del frontend | npm run build aprobado |
| Pruebas existentes del frontend | npm test: 8 aprobadas; usan un servidor de prueba, no Atlas |
| Puerto del frontend | Vite configurado en 5173 con strictPort |
| Arranque sin URI | El backend termina con codigo 1 y no inicia HTTP |
| CORS | Configurado en server/src/index.js con CLIENT_ORIGIN; default localhost:5173 |
| Conexion independiente a Atlas | Aprobada tras corregir la URI privada para usar SRV y los hosts vigentes de Atlas |
| CRUD completo y persistencia en Atlas | Aprobados desde la interfaz: alta, consulta, edicion, reinicio del backend, nueva consulta y borrado; comprobados directamente en Atlas |
| Lint del frontend | 4 errores previos: importaciones sin uso en App.jsx y routes.jsx; variable catch sin uso y exportacion de contexto en AutorizacionesContext.jsx |
| Variables de produccion | Plantillas de backend y frontend, sin credenciales; .env privados ignorados |

La URI privada tenia nombres de hosts que no resolvian. La consulta SRV
de Atlas devolvio los hosts vigentes y permitio conectar con las mismas
credenciales. Se corrigio solamente server/.env, que no se publica.
La prueba automatizada de navegador ingreso con el usuario de Gerencia,
creo un cliente temporal, verifico su alta y edicion directamente en
Atlas, reinicio el backend y comprobo persistencia antes de eliminarlo.
No se modificaron clientes existentes. No hubo errores de JavaScript ni CORS.
Una respuesta HTTP de bienvenida sin conexion a la base no acredita
persistencia; por eso el proceso ahora termina si MongoDB falla.

## Revision de PR existentes

Datos consultados en GitHub. No se modificaron las descripciones ni el
historial de los PR de los companeros.

| PR | Estado | Commits | Descripcion e IA |
| --- | --- | --- | --- |
| [#1 Setup](https://github.com/Lucianogiron10/TP02-LYEP-GRUPO14/pull/1) | Integrado | 1 | Sin descripcion ni declaratoria de IA |
| [#2 Frontend](https://github.com/Lucianogiron10/TP02-LYEP-GRUPO14/pull/2) | Integrado | 2 | Sin descripcion ni declaratoria de IA |
| [#3 Backend alternativo](https://github.com/Lucianogiron10/TP02-LYEP-GRUPO14/pull/3) | Cerrado sin integrar; rama eliminada | 2 | Sin descripcion; no forma parte de la entrega actual |
| [#4 API REST](https://github.com/Lucianogiron10/TP02-LYEP-GRUPO14/pull/4) | Integrado | 3 | Sin descripcion ni declaratoria de IA |
| [#5 QA](https://github.com/Lucianogiron10/TP02-LYEP-GRUPO14/pull/5) | Integrado | 2 | Incluye que, como, archivos y declaratoria de Gemini |

En #5 se indica que se modifico server/src/index.js, pero el archivo
agregado fue client/src/index.js. Ese servidor CommonJS no se importa
desde client/src/main.jsx ni lo ejecuta Vite. Esta rama retira el archivo
duplicado y deja la configuracion CORS en el servidor real.

## Control formal de la consigna

- Las ramas de DB, API REST y frontend usan feature/ y contienen nombre y
  apellido. La rama de QA se llama garcia-andre-alvaro: no usa feature/ y
  el nombre debe confirmarlo su autor.
- La rama DB incluye un commit llamado Correccion de codigo (144299e),
  que no sigue el formato semantico descriptivo exigido.
- La rama de documentacion y deploy usa feature/Giron-Luciano-Documentacion-Deploy
  y se entrega con dos commits semanticos. Se mantiene la autoría real;
  no se atribuye trabajo a un quinto integrante distinto.
- El PR #1 tiene un solo commit. La consigna pide al menos dos commits por
  rama; editar una descripcion ahora no modifica ese hecho historico.
- Los PR #1, #2 y #4 carecen de la descripcion y declaratoria exigidas.
  Los autores deben completarlas con informacion veraz de las herramientas
  utilizadas. La regla del TP tambien sanciona abrir/cerrar PR sin
  descripcion: la correccion posterior no garantiza que se considere
  subsanado. Consultar a la catedra si corresponde.
- La existencia de varias ramas de Luciano no demuestra que cinco personas
  hayan realizado una contribucion individual. Cada integrante debe
  identificar su propia rama, commits y PR para la entrega.
- Esta entrega se sube por feature/ y PR; no se hace push directo a main.

## Pendientes antes de afirmar cumplimiento total

1. Cambiar la contrasena de Atlas que aparecia en server/.env.example.
   El ejemplo ya se reemplazo por placeholders, pero la credencial sigue
   en el historial. Actualizar el .env privado y no volver a publicarlo.
2. Conexion a Atlas y prueba completa de interfaz: resueltas y aprobadas
   el 11/10/2026, incluida la persistencia tras reiniciar el backend.
3. Resolver los puntos formales de PR, commits y nombre de rama descritos
   arriba. No reescribir el historial del equipo para simular cumplimiento.
4. Revisar los cuatro errores previos de lint si se exige entregar todos
   los controles estaticos en verde; no impidieron el build.
5. Revisar e integrar el PR de documentacion y deploy y ejecutar los
   comandos del README en la maquina del equipo.

Estado: funcionamiento tecnico verificado con la base real de Atlas;
los controles formales anteriores se mantienen separados del resultado
de ejecucion. No se publico un despliegue en la nube; la consigna
comprueba ejecucion local en 5173 y 3001.

## Declaratoria de uso de IA

Herramienta: OpenAI Codex. Asistencia: revision del PDF y del repositorio,
redaccion de documentacion y plantilla de PR, configuracion de variables,
CORS y arranque, y ejecucion de verificaciones. Evaluacion: contraste con
las rutas y modelos existentes, build, pruebas existentes, arranque sin
URI, intento de conexion real y revision de metadatos de PR. Se registran
los fallos y pendientes; no se declaran pruebas de Atlas aprobadas sin
haberlas ejecutado correctamente.
