import '../css/detallecliente.css'
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useAutorizaciones from '../hooks/useAutorizaciones'
import clientesService from "../services/clientesService";
import { mensajeErrorApi } from "../services/api";
import FormCliente from "../components/FormCliente";
 
const DetalleCliente = () => {
  const { id } = useParams();
  return <FichaCliente key={id} id={id} />;
};

const FichaCliente = ({ id }) => {
  const navigate = useNavigate();
  const { admin } = useAutorizaciones()
  const role = admin?.sector;

  const [cliente, setCliente] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [editando, setEditando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    clientesService.obtenerCliente(id, { signal: controller.signal })
      .then(setCliente)
      .catch((error) => {
        if (controller.signal.aborted) return;
        setError(mensajeErrorApi(error, "Error al cargar el cliente."));
      });
    return () => controller.abort();
  }, [id]);

  const eliminarCliente = async () => {
    setMensaje("");
    setError("");
    setEliminando(true);
    try {
      await clientesService.eliminarCliente(id);
      navigate("/clientes", { replace: true });
    } catch (error) {
      setError(mensajeErrorApi(error, "Error al eliminar cliente."));
    } finally {
      setEliminando(false);
    }
  };
  if (error && !cliente) {
    return <div role="alert"><h2>{error}</h2><Link to="/clientes">Volver a clientes</Link></div>;
  }
  if (!cliente) {
    return <h2>Cargando cliente...</h2>;
  }

  return (
    <div className="detalle-cliente">
      <h1>Ficha del Cliente</h1>
      <p>Rol actual: {role}</p>

      {mensaje && <p className = 'mensaje-eliminado'>{mensaje}</p>}
      {error && <p role="alert">{error}</p>}
      <Link to="/clientes">Volver a clientes</Link>

      {editando && (
        <FormCliente
          cliente={cliente}
          onCancelar={() => setEditando(false)}
          onGuardado={(actualizado) => {
            setCliente(actualizado);
            setEditando(false);
            setMensaje("Cliente actualizado correctamente");
            setError("");
          }}
        />
      )}

      <p>
        <strong>ID:</strong> {cliente.id}
      </p>

      <p>
        <strong>Nombre:</strong>{" "}
        {cliente.name.firstname} {cliente.name.lastname}
      </p>

      <p>
        <strong>Email:</strong> {cliente.email}
      </p>

      <p>
        <strong>Teléfono:</strong> {cliente.phone}
      </p>

      <h2>Dirección</h2>

      <p>
        <strong>Calle:</strong> {cliente.address.street}
      </p>

      <p>
        <strong>Número:</strong> {cliente.address.number}
      </p>

      <p>
        <strong>Código Postal:</strong> {cliente.address.zipcode}
      </p>

      <p>
        <strong>Ciudad:</strong> {cliente.address.city}
      </p>

      <h2>Usuario</h2>

      <p>
        <strong>Usuario:</strong> {cliente.username}
      </p>

      {role?.trim() === "Gerencia" && !editando && (
        <>
          <button className="btn-ficha" disabled={eliminando} onClick={() => setEditando(true)}>
            Editar Cliente
          </button>
          <button className='btn-eliminar' disabled={eliminando} onClick={eliminarCliente}>
            {eliminando ? "Eliminando..." : "Eliminar Cliente"}
          </button>
        </>
      )}
    </div>
  );
};

export default DetalleCliente;
