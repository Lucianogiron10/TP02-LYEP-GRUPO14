# Casos de Prueba - Validación de Integración (Backend y Frontend)

Este documento registra los casos de prueba ejecutados para validar la integración de la API REST, la conexión con MongoDB Atlas y la comunicación con el frontend sin errores de CORS.

## Matriz de Casos de Prueba CRUD y Conectividad

| ID | Módulo / Funcionalidad | Descripción de la Prueba | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Conexión Servidor | Iniciar el servidor backend en el puerto 3001 y verificar su respuesta base. | El servidor responde correctamente en `localhost:3001`. | 🟢 Aprobado |
| **TC-02** | Configuración CORS | Realizar peticiones desde el frontend (`localhost:5173`) hacia el backend. | Cero bloqueos o errores de políticas CORS en la consola del navegador. | 🟢 Aprobado |
| **TC-03** | Read (GET) | Cargar el listado de clientes desde la interfaz de usuario. | Se listan correctamente todos los registros obtenidos de MongoDB Atlas. | 🟢 Aprobado |
| **TC-04** | Create (POST) | Registrar un nuevo cliente mediante el formulario de la aplicación. | El cliente se guarda en la base de datos y la interfaz se actualiza de inmediato. | 🟢 Aprobado |
| **TC-05** | Update (PUT) | Modificar los datos de un cliente existente desde su ficha de detalle. | Los cambios se actualizan correctamente tanto en la UI como en la BD. | 🟢 Aprobado |
| **TC-06** | Delete (DELETE) | Eliminar un registro utilizando los permisos correspondientes. | El registro es borrado de la base de datos y desaparece de la vista. | 🟢 Aprobado |

## Verificaciones Técnicas Adicionales
- **Variables de entorno:** Configuradas mediante `.env` para el acceso seguro a MongoDB Atlas.
- **Herramientas de prueba:** Validación manual de endpoints mediante la interfaz web y pruebas de red (Network tab).