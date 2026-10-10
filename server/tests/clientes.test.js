import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app.js";
import Cliente from "../src/models/Cliente.js";

let mongo;
let server;
let baseURL;

const nuevoCliente = (email = "luciano@example.com") => ({
  name: { firstname: "Luciano", lastname: "Giron" },
  address: { city: "Jujuy", street: "Belgrano", number: 123, zipcode: "4600" },
  email,
  phone: "3881234567",
  username: "luciano",
});

const solicitar = (ruta, method = "GET", body, headers = {}) => fetch(`${baseURL}${ruta}`, {
  method,
  headers: { ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...headers },
  body: body === undefined ? undefined : JSON.stringify(body),
});

before(async () => {
  // La URI siempre corresponde a la instancia temporal, nunca a Atlas.
  mongo = await MongoMemoryServer.create({ instance: { dbName: "tp2-tests" } });
  await mongoose.connect(mongo.getUri());
  await Cliente.init();
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseURL = `http://127.0.0.1:${server.address().port}`;
}, { timeout: 180000 });

beforeEach(async () => {
  await Cliente.deleteMany({});
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

test("GET health confirma que MongoDB esta conectado", async () => {
  const respuesta = await solicitar("/api/health");
  assert.equal(respuesta.status, 200);
  assert.equal((await respuesta.json()).database, "connected");
});

test("CRUD persiste, consulta, modifica y elimina un cliente real", async () => {
  const alta = await solicitar("/api/clientes", "POST", nuevoCliente());
  assert.equal(alta.status, 201);
  const creado = await alta.json();
  assert.match(creado._id, /^[a-f0-9]{24}$/);
  assert.equal(await Cliente.countDocuments(), 1);

  const listado = await (await solicitar("/api/clientes")).json();
  assert.equal(listado.length, 1);
  assert.equal(listado[0]._id, creado._id);

  const ficha = await solicitar(`/api/clientes/${creado._id}`);
  assert.equal(ficha.status, 200);
  assert.deepEqual((await ficha.json()).name, nuevoCliente().name);

  const actualizacion = await solicitar(`/api/clientes/${creado._id}`, "PUT", {
    ...nuevoCliente(), address: { ...nuevoCliente().address, city: "Salta" },
  });
  assert.equal(actualizacion.status, 200);
  assert.equal((await actualizacion.json()).address.city, "Salta");
  assert.equal((await Cliente.findById(creado._id)).address.city, "Salta");

  // Reconectar verifica que el dato esta en MongoDB y no en memoria de Express.
  await mongoose.disconnect();
  await mongoose.connect(mongo.getUri());
  const trasReconectar = await (await solicitar(`/api/clientes/${creado._id}`)).json();
  assert.equal(trasReconectar.address.city, "Salta");

  const baja = await solicitar(`/api/clientes/${creado._id}`, "DELETE");
  assert.equal(baja.status, 204);
  assert.equal(await baja.text(), "");
  assert.equal(await Cliente.countDocuments(), 0);
  assert.equal((await solicitar(`/api/clientes/${creado._id}`)).status, 404);
});

test("GET devuelve un array vacio si no hay clientes", async () => {
  assert.deepEqual(await (await solicitar("/api/clientes")).json(), []);
});

test("POST rechaza campos obligatorios ausentes y email invalido", async () => {
  for (const body of [{ name: { firstname: "Luciano" } }, { ...nuevoCliente(), email: "sin-email" }]) {
    const respuesta = await solicitar("/api/clientes", "POST", body);
    assert.equal(respuesta.status, 400);
    assert.ok((await respuesta.json()).details.length > 0);
  }
  assert.equal(await Cliente.countDocuments(), 0);
});

test("POST y PUT rechazan emails duplicados con 409", async () => {
  await Cliente.create(nuevoCliente());
  const otro = await Cliente.create(nuevoCliente("otro@example.com"));
  assert.equal((await solicitar("/api/clientes", "POST", nuevoCliente())).status, 409);
  const respuesta = await solicitar(`/api/clientes/${otro._id}`, "PUT", { email: nuevoCliente().email });
  assert.equal(respuesta.status, 409);
  assert.match((await respuesta.json()).error, /email/);
  assert.equal((await Cliente.findById(otro._id)).email, "otro@example.com");
});

test("PUT valida los cambios y conserva el documento si son invalidos", async () => {
  const creado = await Cliente.create(nuevoCliente());
  const respuesta = await solicitar(`/api/clientes/${creado._id}`, "PUT", { phone: "" });
  assert.equal(respuesta.status, 400);
  assert.equal((await Cliente.findById(creado._id)).phone, nuevoCliente().phone);
});

test("GET, PUT y DELETE distinguen id invalido y cliente inexistente", async () => {
  for (const method of ["GET", "PUT", "DELETE"]) {
    const body = method === "PUT" ? nuevoCliente() : undefined;
    assert.equal((await solicitar("/api/clientes/id-invalido", method, body)).status, 400);
    assert.equal((await solicitar("/api/clientes/507f1f77bcf86cd799439099", method, body)).status, 404);
  }
});

test("rechaza cuerpos vacios, arrays y JSON mal formado", async () => {
  for (const body of [undefined, [], {}, { password: "no-permitida" }]) {
    assert.equal((await solicitar("/api/clientes", "POST", body)).status, 400);
  }
  const respuesta = await fetch(`${baseURL}/api/clientes`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{",
  });
  assert.equal(respuesta.status, 400);
  assert.match((await respuesta.json()).error, /JSON/);
});

test("ignora campos ajenos al modelo y operadores enviados por el cliente", async () => {
  const respuesta = await solicitar("/api/clientes", "POST", {
    ...nuevoCliente(), password: "no-guardar", admin: true, $set: { email: "otro@example.com" },
  });
  const creado = await respuesta.json();
  assert.equal(respuesta.status, 201);
  assert.equal(creado.password, undefined);
  assert.equal(creado.admin, undefined);
  assert.equal(creado.email, nuevoCliente().email);
});

test("CORS permite al frontend y responde los preflight de PUT y DELETE", async () => {
  const origen = "http://localhost:5173";
  const respuesta = await solicitar("/api/clientes", "GET", undefined, { Origin: origen });
  assert.equal(respuesta.headers.get("access-control-allow-origin"), origen);
  for (const method of ["PUT", "DELETE"]) {
    const preflight = await solicitar("/api/clientes/507f1f77bcf86cd799439099", "OPTIONS", undefined, {
      Origin: origen,
      "Access-Control-Request-Method": method,
      "Access-Control-Request-Headers": "content-type",
    });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get("access-control-allow-origin"), origen);
    assert.ok(preflight.headers.get("access-control-allow-methods").includes(method));
    assert.match(preflight.headers.get("access-control-allow-headers"), /Content-Type/i);
  }
  const externo = await solicitar("/api/clientes", "GET", undefined, { Origin: "https://otro.example" });
  assert.equal(externo.headers.get("access-control-allow-origin"), null);
});

test("las rutas desconocidas devuelven 404 en JSON", async () => {
  const respuesta = await solicitar("/api/items");
  assert.equal(respuesta.status, 404);
  assert.equal(typeof (await respuesta.json()).error, "string");
});
