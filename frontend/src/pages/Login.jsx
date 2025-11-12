import { useState } from "react";
const API_URL = "http://localhost:3000/api/auth";

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    apellido: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e) => { // 👈 HACER ESTA FUNCIÓN ASÍNCRONA
    e.preventDefault();
    setError(null); // Limpiar errores anteriores

    // 1. Validaciones básicas del frontend (Confirmar Contraseña)
    if (isRegister && formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    
    // 2. Determinar el endpoint y los datos a enviar
    const endpoint = isRegister ? `${API_URL}/register` : `${API_URL}/login`;
    
    // Datos de la petición: Solo enviamos lo que el endpoint necesita
    const dataToSend = isRegister 
      ? { email: formData.email, password: formData.password, nombre: formData.nombre, apellido: formData.apellido }
      : { email: formData.email, password: formData.password };

    // 3. Llamada a la API del backend (Node.js/Express)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
        credentials: 'include'
      });

      // 4. Manejo de la Respuesta
      const responseData = await response.json();

      if (response.ok) { // Código 200, 201 (Éxito)
        alert(isRegister ? "Registro exitoso. ¡Inicia sesión!" : "Ingreso exitoso!");
        // Aquí debes guardar el token de sesión (JWT) en el localStorage si lo usas
        // y luego llamar a la función que cambia la vista principal:
        localStorage.setItem('token', responseData.token);
        onLogin(responseData);
      } else { 
//        const errorData = await response.json();
        // Código 400, 401, 409, 500 (Fallo)
        // El backend devuelve el mensaje de error en responseData.message
        // Captura errores de validación, clave débil, o email ya registrado.
        const errorMessage = responseData.message || responseData.mensaje || "Error desconocido en el servidor.";
       // setError(responseData.mensaje || "Ocurrió un error desconocido.");
        setError(errorMessage);
        console.error(`Fallo del Backend (${response.status}):`, errorMessage);
      }

    } catch (networkError) {
      // Manejo de errores de red (servidor caído, CORS no configurado)
      setError("Error de conexión. ¿Está el servidor de backend iniciado?");
      console.error("Network Error:", networkError);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      email: "",
      nombre: "",
      apellido: "",
      password: "",
      confirmPassword: ""
    });
  };

  const handleToggleMode = () => {
    setIsRegister(!isRegister);
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        
        {/* Header unificado y centrado */}
        <div className="text-center mb-8">
          {/* Logo y título en línea */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📦</span>
            </div>
            <h1 className="text-2xl font-poppins text-gray-800">Sistema de Gestión de Cargas</h1>
          </div>
          
          {/* Subtítulo */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {isRegister ? "Crear cuenta" : "Bienvenido"}
            </h2>
            <p className="text-gray-600">
              {isRegister ? "Regístrate para comenzar" : "Inicia sesión en tu cuenta"}
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-900 bg-white"
              required
            />
          </div>

        {isRegister && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Carlos"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-900 bg-white"
              required
            />
          </div>
        )}

          {isRegister && (
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellido
            </label>
            <input
              type="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              placeholder="Perez"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-900 bg-white"
              required
            />
          </div>
          )}

          {/* Campo Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-900 bg-white"
              required
              minLength="6"
            />
          </div>

          {/* Campo Confirmar Contraseña (solo en registro) */}
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-900 bg-white"
                required
                minLength="6"
              />
            </div>
          )}

          {/* Botón principal - único y centrado */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 font-medium transition duration-200 shadow-md mt-6"
          >
            {isRegister ? "Crear cuenta" : "Ingresar"}
          </button>
        </form>

        {/* Toggle entre Login/Registro - centrado */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {isRegister ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}{" "}
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-white hover:text-indigo-700 font-medium bg-transparent border-none no-underline hover:no-underline transition duration-200"
            >
              {isRegister ? "Iniciar sesión" : "Registrarse"}
            </button>
          </p>
        </div>

        {/* Términos y condiciones - centrado */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Al {isRegister ? "registrarte" : "iniciar sesión"} aceptas nuestros{" "}
            <a href="#" className="text-indigo-600 hover:underline">
              términos y condiciones
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}