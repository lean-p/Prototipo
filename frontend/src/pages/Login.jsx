import { useState } from "react";

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegister && formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    if (!formData.email || !formData.password) {
      alert("Por favor completa todos los campos");
      return;
    }

    onLogin();
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