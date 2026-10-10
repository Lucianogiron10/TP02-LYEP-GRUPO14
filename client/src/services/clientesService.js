import api from "./api.js";

// MongoDB devuelve _id; las vistas existentes utilizan id.
const normalizarCliente = (cliente) => {
  if (!cliente || typeof cliente !== "object" || !(cliente._id || cliente.id)) {
    throw new Error("La API devolvio un cliente sin identificador.");
  }

  return {
    ...cliente,
    id: String(cliente._id || cliente.id),
    name: cliente.name || {},
    address: cliente.address || {},
  };
};

const obtenerClientes = async (config = {}) => {
  const { data } = await api.get("/clientes", config);
  if (!Array.isArray(data)) {
    throw new Error("La API devolvio un listado de clientes invalido.");
  }
  return data.map(normalizarCliente);
};

const obtenerCliente = async (id, config = {}) => {
  const { data } = await api.get(`/clientes/${encodeURIComponent(id)}`, config);
  return normalizarCliente(data);
};

const crearCliente = async (cliente) => {
  const { data } = await api.post("/clientes", cliente);
  return normalizarCliente(data);
};

const actualizarCliente = async (id, cliente) => {
  const { data } = await api.put(`/clientes/${encodeURIComponent(id)}`, cliente);
  return normalizarCliente(data);
};

const eliminarCliente = async (id) => {
  await api.delete(`/clientes/${encodeURIComponent(id)}`);
};

export default {
  obtenerClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};
