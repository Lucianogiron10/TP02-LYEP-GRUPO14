import '../css/formcliente.css'
import { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import clientesService from "../services/clientesService";
import { mensajeErrorApi } from "../services/api";

const FormCliente = ({ cliente, onGuardado, onCancelar }) => {

    const [nombre, setNombre] = useState(cliente?.name.firstname || "");
    const [apellido, setApellido] = useState(cliente?.name.lastname || "");
    const [email, setEmail] = useState(cliente?.email || "");
    const [telefono, setTelefono] = useState(cliente?.phone || "");
    const [ciudad, setCiudad] = useState(cliente?.address.city || "");

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const manejarSubmit = async (e) => {

        e.preventDefault();

        setMensaje("");
        setError("");

        if (
            nombre.trim() === "" ||
            apellido.trim() === "" ||
            email.trim() === "" ||
            telefono.trim() === "" ||
            ciudad.trim() === ""
        ) {

            setError("Complete todos los campos.");

            return;
        }

        const nuevoCliente = {

            email: email.trim(),

            username: cliente?.username || nombre.trim().toLowerCase().replace(/\s/g, ""),

            name: {
                firstname: nombre.trim(),
                lastname: apellido.trim()
            },

            address: {
                ...cliente?.address,
                city: ciudad.trim()
            },

            phone: telefono.trim()
        };

        try {

            setLoading(true);

            const respuesta = cliente
                ? await clientesService.actualizarCliente(cliente.id, nuevoCliente)
                : await clientesService.crearCliente(nuevoCliente);

            setMensaje(
                `Cliente ${cliente ? "actualizado" : "creado"} correctamente. ID: ${respuesta.id}`
            );

            if (!cliente) {
                setNombre("");
                setApellido("");
                setEmail("");
                setTelefono("");
                setCiudad("");
            }
            onGuardado?.(respuesta);

        } catch (error) {

            setError(
                mensajeErrorApi(error, "Ocurrió un error al guardar el cliente.")
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className='formulario-cliente'>

            <h3>{cliente ? "Editar Cliente" : "Nuevo Cliente"}</h3>

            <Form onSubmit={manejarSubmit}>

                <Form.Group className="mb-3">

                    <Form.Label htmlFor="cliente-nombre">Nombre</Form.Label>

                    <Form.Control
                        id="cliente-nombre"
                        required
                        type="text"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                    />

                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label htmlFor="cliente-apellido">Apellido</Form.Label>
                    <Form.Control
                        id="cliente-apellido"
                        type="text"
                        required
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label htmlFor="cliente-email">Email</Form.Label>

                    <Form.Control
                        id="cliente-email"
                        required
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label htmlFor="cliente-telefono">Teléfono</Form.Label>

                    <Form.Control
                        id="cliente-telefono"
                        required
                        type="text"
                        value={telefono}
                        onChange={(e) =>
                            setTelefono(e.target.value)
                        }
                    />

                </Form.Group>

                <Form.Group className="mb-3">

                    <Form.Label htmlFor="cliente-ciudad">Ciudad</Form.Label>

                    <Form.Control
                        id="cliente-ciudad"
                        required
                        type="text"
                        value={ciudad}
                        onChange={(e) =>
                            setCiudad(e.target.value)
                        }
                    />

                </Form.Group>

                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                >

                    {
                        loading
                            ? <Spinner size="sm" />
                            : "Guardar Cliente"
                    }

                </Button>

                {onCancelar && (
                    <Button variant="secondary" type="button" disabled={loading} onClick={onCancelar}>
                        Cancelar
                    </Button>
                )}

            </Form>

            {
                mensaje &&
                <Alert
                    className="mt-3"
                    variant="success"
                >
                    {mensaje}
                </Alert>
            }

            {
                error &&
                <Alert
                    className="mt-3"
                    variant="danger"
                >
                    {error}
                </Alert>
            }

        </div>

    );
};

export default FormCliente;
