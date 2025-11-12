import { useState, useEffect} from "react";
import { useOutletContext } from 'react-router-dom';
import { CheckCircle, XCircle } from "lucide-react"; // Añadimos XCircle para errores
import ContextMenu from "./ContextMenu";

// URL base de tu API de seguimiento
const API_URL = "http://localhost:3000/api/tracks";

export default function RegistrarSeguimiento({ currentUser, onLogout, onBack }) {
    const [tracking, setTracking] = useState("");
    const [transportista, setTransportista] = useState("DHL");
    const [status, setStatus] = useState({ success: false, error: null, loading: false });

    const { setTitle } = useOutletContext();

    // 3. Llama a 'setTitle' cuando este componente se monte
    useEffect(() => {
        setTitle('Registrar seguimiento');
    }, [setTitle]);

    // 🚨 Función de envío de datos al backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(status.loading) return;
        
        if (tracking.trim() === "" || !transportista) {
            setStatus({ success: false, error: "Debes ingresar el número de tracking y seleccionar un transportista.", loading: false });
            return;
        }

        setStatus({ success: false, error: null, loading: true });
        
        // 1. Obtener el token de la sesión
        // 🚨 CORRECCIÓN: Usamos el encadenamiento opcional (?.) para evitar fallos si currentUser es null
        const token = currentUser?.token; 

        // Chequeo de seguridad adicional: Si no hay token, fallamos inmediatamente.
        if (!token) {
            setStatus({ success: false, error: "Error de autenticación. Por favor, reinicia la sesión.", loading: false });
            return;
        }

        // 2. Datos a enviar al backend
        const dataToSend = {
            nro_tracking: tracking.trim(),
            transportista: transportista, 
        };

        console.log(dataToSend);

        try {
            const response = await fetch(API_URL + '/registerTrack', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 🚨 ENCABEZADO DE AUTORIZACIÓN JWT
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify(dataToSend),
            });

            // Leer la respuesta (será la data del seguimiento creado o el objeto de error)
            const responseData = await response.json(); 
            console.log(responseData);
            if (response.ok) { // 201 Created (Éxito)
                setStatus({ success: true, error: null, loading: false });
                setTracking(""); // Limpiar el campo
                console.log("Seguimiento creado:", responseData);
            } else { // 400, 401, 409, 500 (Fallo)
                // Extraer el mensaje de error del backend
                const errorMessage = responseData.message || responseData.mensaje || "Error desconocido al registrar.";
                setStatus({ success: false, error: errorMessage, loading: false });
            }

        } catch (networkError) {
            // Error de red (servidor caído)
            setStatus({ success: false, error: "Error de conexión con el servidor. Por favor, verifica el backend.", loading: false });
            console.error("Network Error:", networkError);
        }
    };

    const isSuccess = status.success;
    const isLoading = status.loading;
    const currentError = status.error;


    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Barra lateral con logo */}
            {/* Contenido principal */}
            <div className="flex-1 p-6 flex flex-col">
                {/* Contenedor para centrar la caja */}
                <div className="flex-1 flex items-center justify-center">
                    {/* Caja del formulario centrada */}
                    <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-gray-200">
                        
                        {/* --- Mensajes de Estado y Error --- */}
                        {currentError && (
                            <div className="flex items-center gap-3 mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-xl">
                                <XCircle className="w-5 h-5" />
                                <p className="text-sm font-medium">{currentError}</p>
                            </div>
                        )}
                        
                        {isSuccess ? (
                            // Vista de éxito
                            <div className="flex flex-col items-center text-center py-8">
                                <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
                                <p className="text-xl text-gray-800 font-semibold">
                                    ¡Seguimiento Creado Exitosamente!
                                </p>
                                <p className="text-gray-600 mt-2">La información se actualizará en tu Dashboard.</p>
                                <button
                                    onClick={onBack}
                                    className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg"
                                >
                                    Volver al Dashboard
                                </button>
                            </div>
                        ) : (
                            // Formulario
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Datos de la Carga</h2>
                                
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        Número de tracking
                                    </label>
                                    <input
                                        type="text"
                                        value={tracking}
                                        onChange={(e) => setTracking(e.target.value)}
                                        placeholder="Ej: JD014600012252822992"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">Transportista</label>
                                    <select
                                        value={transportista}
                                        onChange={(e) => setTransportista(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white appearance-none"
                                        disabled={isLoading}
                                    >
                                        <option value="DHL">DHL</option>
                                        <option value="FedEx">FedEx</option>
                                        <option value="UPS">UPS</option>
                                        <option value="Correo Argentino">Correo Argentino</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full py-3 rounded-xl transition font-semibold shadow-md flex items-center justify-center gap-2 ${
                                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        'Crear Seguimiento'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}