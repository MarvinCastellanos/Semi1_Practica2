import { useEffect, useState } from "react";

import {
    FileText,
    Image,
    File,
    Upload,
    Download,
    Trash2,
    X
} from "lucide-react";

import { API_PYTHON } from "../api";

function Archivos({ usuario }) {
    const [archivos, setArchivos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [formulario, setFormulario] = useState({
        nombre: "",
        tipo: "",
        url: ""
    });

    const [procesando, setProcesando] = useState(false);

    /*
     * ============================================================
     * CARGAR ARCHIVOS
     * ============================================================
     */

    const cargarArchivos = async () => {
        if (!usuario?.id) {
            return;
        }

        try {
            setCargando(true);
            setError("");

            const respuesta = await fetch(
                `${API_PYTHON}/archivos?usuario_id=${usuario.id}`
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setError(
                    datos.mensaje ||
                    "No se pudieron cargar los archivos"
                );
                return;
            }

            const archivosValidos = Array.isArray(datos)
                ? datos.filter((archivo) => archivo)
                : [];

            setArchivos(archivosValidos);

        } catch (error) {
            console.error(error);

            setError(
                "No se pudo conectar con el servidor"
            );
        } finally {
            setCargando(false);
        }
    };

    /*
     * ============================================================
     * CARGAR AL ENTRAR
     * ============================================================
     */

    useEffect(() => {
        cargarArchivos();
    }, [usuario]);

    /*
     * ============================================================
     * CAMBIOS DEL FORMULARIO
     * ============================================================
     */

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    /*
     * ============================================================
     * ABRIR FORMULARIO
     * ============================================================
     */

    const abrirFormulario = () => {
        setFormulario({
            nombre: "",
            tipo: "",
            url: ""
        });

        setError("");
        setMostrarFormulario(true);
    };

    /*
     * ============================================================
     * CERRAR FORMULARIO
     * ============================================================
     */

    const cerrarFormulario = () => {
        if (procesando) {
            return;
        }

        setMostrarFormulario(false);

        setFormulario({
            nombre: "",
            tipo: "",
            url: ""
        });
    };

    /*
     * ============================================================
     * REGISTRAR ARCHIVO
     * ============================================================
     */

    const registrarArchivo = async (e) => {
        e.preventDefault();

        if (
            !formulario.nombre.trim() ||
            !formulario.tipo.trim() ||
            !formulario.url.trim()
        ) {
            setError(
                "Todos los campos son obligatorios"
            );
            return;
        }

        try {
            setProcesando(true);
            setError("");

            const respuesta = await fetch(
                `${API_PYTHON}/archivos`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        usuario_id: usuario.id,
                        nombre: formulario.nombre,
                        tipo: formulario.tipo,
                        url: formulario.url
                    })
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setError(
                    datos.mensaje ||
                    "No se pudo registrar el archivo"
                );
                return;
            }

            await cargarArchivos();

            cerrarFormulario();

        } catch (error) {
            console.error(error);

            setError(
                "No se pudo conectar con el servidor"
            );
        } finally {
            setProcesando(false);
        }
    };

    /*
     * ============================================================
     * VER ARCHIVO
     * ============================================================
     */

    const verArchivo = (archivo) => {
        if (!archivo?.url) {
            setError(
                "El archivo no tiene una URL disponible"
            );
            return;
        }

        window.open(
            archivo.url,
            "_blank",
            "noopener,noreferrer"
        );
    };

    /*
     * ============================================================
     * ELIMINAR ARCHIVO
     * ============================================================
     */

    const eliminarArchivo = async (archivo) => {
        if (!archivo) {
            return;
        }

        const confirmar = window.confirm(
            `¿Deseas eliminar el archivo "${archivo.nombre}"?`
        );

        if (!confirmar) {
            return;
        }

        try {
            setProcesando(true);
            setError("");

            const respuesta = await fetch(
                `${API_PYTHON}/archivos/${archivo.id}?usuario_id=${usuario.id}`,
                {
                    method: "DELETE"
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setError(
                    datos.mensaje ||
                    "No se pudo eliminar el archivo"
                );
                return;
            }

            await cargarArchivos();

        } catch (error) {
            console.error(error);

            setError(
                "No se pudo conectar con el servidor"
            );
        } finally {
            setProcesando(false);
        }
    };

    /*
     * ============================================================
     * ICONO SEGÚN TIPO
     * ============================================================
     */

    const obtenerIcono = (tipo) => {
        if (tipo?.startsWith("image/")) {
            return <Image size={23} />;
        }

        if (
            tipo?.startsWith("text/") ||
            tipo === "Texto"
        ) {
            return <FileText size={23} />;
        }

        return <File size={23} />;
    };

    /*
     * ============================================================
     * INTERFAZ
     * ============================================================
     */

    return (
        <div className="content-page">

            <div className="page-header">

                <div>
                    <p className="page-greeting">
                        Almacenamiento
                    </p>

                    <h1>Archivos</h1>

                    <p className="page-description">
                        Administra tus documentos y archivos almacenados.
                    </p>
                </div>

                <button
                    className="primary-action"
                    onClick={abrirFormulario}
                    disabled={procesando}
                >
                    <Upload size={19} />
                    Subir archivo
                </button>

            </div>

            {mostrarFormulario && (
                <div className="task-form-card">

                    <div className="task-form-header">

                        <div>
                            <h2>
                                Registrar archivo
                            </h2>

                            <p>
                                Agrega la información de un archivo
                                almacenado.
                            </p>
                        </div>

                        <button
                            className="modal-close"
                            type="button"
                            onClick={cerrarFormulario}
                            disabled={procesando}
                        >
                            <X size={20} />
                        </button>

                    </div>

                    <form
                        className="task-form"
                        onSubmit={registrarArchivo}
                    >

                        <div className="input-group">

                            <label htmlFor="nombre">
                                Nombre del archivo
                            </label>

                            <input
                                id="nombre"
                                name="nombre"
                                type="text"
                                value={formulario.nombre}
                                onChange={manejarCambio}
                                placeholder="Ejemplo: documento.txt"
                                required
                            />

                        </div>

                        <div className="input-group">

                            <label htmlFor="tipo">
                                Tipo de archivo
                            </label>

                            <input
                                id="tipo"
                                name="tipo"
                                type="text"
                                value={formulario.tipo}
                                onChange={manejarCambio}
                                placeholder="Ejemplo: text/plain"
                                required
                            />

                        </div>

                        <div className="input-group">

                            <label htmlFor="url">
                                URL del archivo
                            </label>

                            <input
                                id="url"
                                name="url"
                                type="url"
                                value={formulario.url}
                                onChange={manejarCambio}
                                placeholder="https://ejemplo.com/archivo.txt"
                                required
                            />

                        </div>

                        <div className="task-form-actions">

                            <button
                                type="button"
                                className="secondary-action"
                                onClick={cerrarFormulario}
                                disabled={procesando}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="primary-action"
                                disabled={procesando}
                            >
                                <Upload size={18} />

                                {procesando
                                    ? "Guardando..."
                                    : "Registrar archivo"}
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="storage-card">

                <div className="storage-info">

                    <div className="storage-icon">
                        <File size={22} />
                    </div>

                    <div>
                        <strong>
                            Espacio utilizado
                        </strong>

                        <span>
                            {archivos.length}{" "}
                            {archivos.length === 1
                                ? "archivo almacenado"
                                : "archivos almacenados"}
                        </span>
                    </div>

                </div>

                <div className="storage-bar">

                    <div
                        className="storage-progress"
                        style={{
                            width: `${Math.min(
                                archivos.length * 10,
                                100
                            )}%`
                        }}
                    ></div>

                </div>

                <span className="storage-text">
                    {archivos.length} archivos
                </span>

            </div>

            {cargando && (
                <div className="dashboard-card">
                    <p className="page-description">
                        Cargando archivos...
                    </p>
                </div>
            )}

            {!cargando && !error && archivos.length === 0 && (
                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <h2>
                                No tienes archivos todavía
                            </h2>

                            <p>
                                Registra tu primer archivo para
                                comenzar a utilizar CloudDrive.
                            </p>
                        </div>

                    </div>

                </div>
            )}

            {!cargando && archivos.length > 0 && (
                <div className="files-card">

                    <div className="files-header">

                        <div>
                            <h2>
                                Mis archivos
                            </h2>

                            <p>
                                Todos tus archivos almacenados.
                            </p>
                        </div>

                    </div>

                    <div className="file-list">

                        {archivos
                            .filter((archivo) => archivo)
                            .map((archivo) => (
                                <div
                                    className="file-row"
                                    key={archivo.id}
                                >

                                    <div className="file-type-icon">
                                        {obtenerIcono(
                                            archivo.tipo
                                        )}
                                    </div>

                                    <div className="file-information">

                                        <strong>
                                            {archivo.nombre}
                                        </strong>

                                        <span>
                                            {archivo.tipo}
                                        </span>

                                    </div>

                                    <div className="file-actions">

                                        <button
                                            title="Ver archivo"
                                            onClick={() =>
                                                verArchivo(
                                                    archivo
                                                )
                                            }
                                            disabled={procesando}
                                        >
                                            <Download size={18} />
                                        </button>

                                        <button
                                            title="Eliminar archivo"
                                            onClick={() =>
                                                eliminarArchivo(
                                                    archivo
                                                )
                                            }
                                            disabled={procesando}
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                </div>
                            ))}

                    </div>

                </div>
            )}

        </div>
    );
}

export default Archivos;