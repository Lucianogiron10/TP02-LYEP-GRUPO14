import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import api, { mensajeErrorApi } from "../src/services/api.js";
import clientesService from "../src/services/clientesService.js";

const cliente = {
  _id: "507f1f77bcf86cd799439011",
  name: { firstname: "Luciano", lastname: "Giron" },
  address: { city: "Jujuy" },
  email: "luciano@example.com",
  phone: "3881234567",
};

let responder;
const server = createServer(async (req, res) => {
  let body = "";
  for await (const chunk of req) body += chunk;
  const respuesta = responder(req, body ? JSON.parse(body) : undefined);
  res.writeHead(respuesta.status || 200, { "Content-Type": "application/json" });
  res.end(respuesta.data === undefined ? undefined : JSON.stringify(respuesta.data));
});

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  api.defaults.baseURL = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test("consulta el listado y adapta _id de MongoDB", async () => {
  responder = (req) => {
    assert.equal(req.method, "GET");
    assert.equal(req.url, "/api/clientes");
    return { data: [cliente] };
  };
  const [resultado] = await clientesService.obtenerClientes();
  assert.equal(resultado.id, cliente._id);
  assert.deepEqual(resultado.name, cliente.name);
});

test("consulta la ficha usando el identificador de MongoDB", async () => {
  responder = (req) => {
    assert.equal(req.method, "GET");
    assert.equal(req.url, `/api/clientes/${cliente._id}`);
    return { data: cliente };
  };
  assert.equal((await clientesService.obtenerCliente(cliente._id)).id, cliente._id);
});

test("envia el alta y devuelve el identificador asignado por el backend", async () => {
  const { _id, ...nuevo } = cliente;
  responder = (req, body) => {
    assert.equal(req.method, "POST");
    assert.equal(req.url, "/api/clientes");
    assert.deepEqual(body, nuevo);
    return { status: 201, data: { ...body, _id } };
  };
  assert.equal((await clientesService.crearCliente(nuevo)).id, _id);
});

test("actualiza los datos mediante PUT", async () => {
  const cambios = { ...cliente, phone: "3887654321" };
  responder = (req, body) => {
    assert.equal(req.method, "PUT");
    assert.equal(req.url, `/api/clientes/${cliente._id}`);
    assert.deepEqual(body, cambios);
    return { data: cambios };
  };
  assert.equal((await clientesService.actualizarCliente(cliente._id, cambios)).phone, cambios.phone);
});

test("acepta DELETE con respuesta 204 sin cuerpo", async () => {
  responder = (req) => {
    assert.equal(req.method, "DELETE");
    assert.equal(req.url, `/api/clientes/${cliente._id}`);
    return { status: 204 };
  };
  await clientesService.eliminarCliente(cliente._id);
});

test("propaga errores HTTP y conserva el mensaje del backend", async () => {
  for (const status of [400, 404, 500]) {
    responder = () => ({ status, data: { error: "Cliente no disponible" } });
    await assert.rejects(clientesService.obtenerCliente(cliente._id), (error) => {
      assert.equal(error.response.status, status);
      assert.equal(mensajeErrorApi(error, "Error"), "Cliente no disponible");
      return true;
    });
  }
  assert.equal(mensajeErrorApi(new Error("Network Error"), "Sin conexion"), "Sin conexion");
});

test("rechaza respuestas incompatibles en vez de romper la vista", async () => {
  responder = () => ({ data: { message: "No es un listado" } });
  await assert.rejects(clientesService.obtenerClientes(), /listado/);
  responder = () => ({ data: { name: "Sin id" } });
  await assert.rejects(clientesService.obtenerCliente(cliente._id), /identificador/);
});

test("permite cancelar una consulta al abandonar la pantalla", async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(clientesService.obtenerClientes({ signal: controller.signal }), (error) => {
    assert.equal(error.code, "ERR_CANCELED");
    return true;
  });
});
