import Cliente from "../models/Cliente.js";

const datosCliente = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    const error = new Error("El cuerpo debe ser un objeto JSON de cliente.");
    error.status = 400;
    throw error;
  }

  const campos = ["name", "email", "phone", "address", "username"];
  const datos = Object.fromEntries(
    campos.filter((campo) => Object.hasOwn(body, campo)).map((campo) => [campo, body[campo]]),
  );
  if (Object.keys(datos).length === 0) {
    const error = new Error("Debe enviar datos del cliente.");
    error.status = 400;
    throw error;
  }
  return datos;
};

export const obtenerClientes = async (req, res) => {
  const clientes = await Cliente.find();
  res.json(clientes);
};

export const obtenerCliente = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  if (!cliente) return res.status(404).json({ error: "Cliente no encontrado." });
  res.json(cliente);
};

export const crearCliente = async (req, res) => {
  const cliente = await Cliente.create(datosCliente(req.body));
  res.status(201).json(cliente);
};

export const actualizarCliente = async (req, res) => {
  const cliente = await Cliente.findByIdAndUpdate(
    req.params.id,
    { $set: datosCliente(req.body) },
    { new: true, runValidators: true },
  );
  if (!cliente) return res.status(404).json({ error: "Cliente no encontrado." });
  res.json(cliente);
};

export const eliminarCliente = async (req, res) => {
  const cliente = await Cliente.findByIdAndDelete(req.params.id);
  if (!cliente) return res.status(404).json({ error: "Cliente no encontrado." });
  res.status(204).end();
};
