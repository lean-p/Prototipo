/* === ARCHIVO CORREGIDO: src/pages/Usuario.jsx === */

import React, { useState, useEffect } from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
// --- ¡ARREGLO! Importar los íconos ---
import { XCircle, CheckCircle } from 'lucide-react'; 

const API_URL = "http://localhost:3000/api/auth";

// --- ¡ARREGLO #1! ---
// Usamos llaves { } para desestructurar el objeto 'props'
// Ahora 'currentUser' SÍ es el objeto que esperas.
export default function Usuario({ currentUser, onLogout, onBack }) {

    const { id } = useParams()
    const { setTitle, setCurrentUser } = useOutletContext();
    useEffect(() => {
        setTitle('Mi perfil');
    }, [setTitle]);

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        clave: '', 
        confirmarClave: '' 
    });
    
    // --- ¡ARREGLO! Unificamos 'error' y 'mensaje' en 'status' ---
    const [status, setStatus] = useState({ success: null, error: null, loading: false });
    const navigate = useNavigate();
    // Este console.log ahora mostrará el objeto de usuario correcto


    useEffect(() => {
        // Esta lógica de "pre-llenado" ahora funcionará
        if (currentUser && currentUser.usuario) {
            setFormData({
                nombre: currentUser.usuario.nombre || '',
                apellido: currentUser.usuario.apellido || '',
                clave: '',
                confirmarClave: ''
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // --- ¡ARREGLO! Usamos setStatus ---
        setStatus({ success: false, error: null, loading: true });
        
        const token = currentUser?.token; 

        if (!token) {
            setStatus({ success: false, error: "Error de autenticación. Por favor, reinicia la sesión.", loading: false });
            return;
        }

        if (formData.clave !== formData.confirmarClave) {
            // --- ¡ARREGLO! Usamos setStatus ---
            setStatus({ success: false, error: "Las nuevas contraseñas no coinciden.", loading: false });
            return;
        }

        const datosParaActualizar = {
            nombre: formData.nombre,
            apellido: formData.apellido
        };
        if (formData.clave) {
            datosParaActualzar.clave = formData.clave;
        }
        
        try {
            const response = await fetch(API_URL + '/perfil/', { // (Asegúrate que tu ruta de API sea correcta)
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(datosParaActualizar)
            });

            const resultado = await response.json();

            if (response.ok) {
                // --- ¡ARREGLO! Usamos setStatus ---
                setStatus({ success: true, error: null, loading: false });
                // Limpiamos los campos de contraseña
                setFormData(prev => ({ ...prev, clave: '', confirmarClave: '' }));
                setCurrentUser(prevCurrentUser => ({
                    ...prevCurrentUser, // Copia todo lo viejo (token, etc.)
                    usuario: {
                        ...prevCurrentUser.usuario, // Copia datos viejos (ID, email)
                        ...datosParaActualizar   // Sobreescribe con { nombre, apellido }
                    }
                }));
                console.log("Perfil actualizado:", resultado);
            } else {
                const errorMessage = resultado.message || resultado.error || "Error desconocido al actualizar.";
                // --- ¡ARREGLO! Usamos setStatus ---
                setStatus({ success: false, error: errorMessage, loading: false });
            }

        } catch (err) {
            setStatus({ success: false, error: "Error de conexión con el servidor.", loading: false });
        }
    
    };
    const handleVolverAlFormulario = () => {
        setStatus({ success: false, error: null, loading: false });
    };

    // Extraemos los valores de 'status' para usarlos en el JSX
    const isSuccess = status.success;
    const isLoading = status.loading;
    const currentError = status.error;

    // --- ¡ARREGLO DE SEGURIDAD! ---
    // Añadimos un "guardia" por si 'currentUser' todavía no ha cargado
    if (!currentUser || !currentUser.usuario) {
        return <div>Cargando perfil...</div>; // O un spinner
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <div className="flex-1 p-6 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-gray-200">
                        
                        {currentError && (
                            <div className="flex items-center gap-3 mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-xl">
                                <XCircle className="w-5 h-5" />
                                <p className="text-sm font-medium">{currentError}</p>
                            </div>
                        )}
                        {isSuccess ? (
                            <div className="flex flex-col items-center text-center py-8">
                                <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
                                <p className="text-xl text-gray-800 font-semibold">
                                    ¡Usuario actualizado correctamente!
                                </p>
                                <p className="text-gray-600 mt-2">El perfil se encuentra actualizado.</p>
                                <button
                                    onClick={handleVolverAlFormulario}
                                    className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg"
                                >
                                    Volver
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Perfil</h2>
                                
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">Usuario</label>
                                    <input
                                        type="text"
                                        // --- ¡ARREGLO! Añadimos '?' por seguridad ---
                                        placeholder={currentUser?.usuario?.user}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-gray-100" // Fondo gris
                                        disabled // El usuario (email) no se puede cambiar
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">Nombre</label>
                                    <input
                                        type="text"
                                        // --- ¡ARREGLO #2! ---
                                        name="nombre" // <-- Añadimos 'name'
                                        value={formData.nombre} // <-- Debe ser formData.nombre
                                        onChange={handleChange} // <-- Debe ser handleChange
                                        // --- FIN DEL ARREGLO ---
                                        placeholder={currentUser?.usuario?.nombre}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">Apellido</label>
                                    <input
                                        type="text"
                                        // --- ¡ARREGLO #3! ---
                                        name="apellido" // <-- Añadimos 'name'
                                        value={formData.apellido} // <-- Debe ser formData.apellido
                                        onChange={handleChange} // <-- Debe ser handleChange
                                        // --- FIN DEL ARREGLO ---
                                        placeholder={currentUser?.usuario?.apellido}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                                    <input
                                        type="password"
                                        // --- ¡ARREGLO #4! ---
                                        name="clave" // <-- Debe coincidir con el estado formData
                                        value={formData.clave}
                                        onChange={handleChange} // <-- Debe ser handleChange
                                        // --- FIN DEL ARREGLO ---
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-900 bg-white"
                                        minLength="6" // <-- Quitado 'required'
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
                                    <input
                                        type="password"
                                        // --- ¡ARREGLO #5! ---
                                        name="confirmarClave" // <-- Debe coincidir con el estado formData
                                        value={formData.confirmarClave}
                                        onChange={handleChange} // <-- Debe ser handleChange
                                        // --- FIN DEL ARREGLO ---
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-900 bg-white"
                                        minLength="6" // <-- Quitado 'required'
                                    />
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
                                        'Modificar usuario'
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