import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env?.VITE_API_URL || "http://localhost:3001/api").replace(/\/+$/, ""),
  timeout: 10000,
});

export const mensajeErrorApi = (error, mensaje) => {
  const detalle = error.response?.data;
  if (typeof detalle?.message === "string") return detalle.message;
  if (typeof detalle?.error === "string") return detalle.error;
  return mensaje;
};

export default api;
