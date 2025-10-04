import { useState } from "react";
import { CheckCircle } from "lucide-react";
import ContextMenu from "./ContextMenu";

export default function RegistrarSeguimiento({ onBack }) {
  const [tracking, setTracking] = useState("");
  const [transportista, setTransportista] = useState("DHL");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tracking.trim() === "") return;
    setSuccess(true);
    setTracking("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Barra lateral con logo */}
      <ContextMenu />

      {/* Contenido principal */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Título fuera de la caja */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Registrar Seguimiento</h1>
          <p className="text-gray-600">Agrega un nuevo número de tracking para realizar el seguimiento</p>
        </div>

        {/* Contenedor para centrar la caja */}
        <div className="flex-1 flex items-center justify-center">
          {/* Caja del formulario centrada */}
          <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
            {!success ? (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">
                    Número de tracking
                  </label>
                  <input
                    type="text"
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    placeholder="Ej: DHL123456789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Transportista</label>
                  <select
                    value={transportista}
                    onChange={(e) => setTransportista(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 bg-white"
                  >
                    <option value="DHL">DHL</option>
                    <option value="FedEx">FedEx</option>
                    <option value="UPS">UPS</option>
                    <option value="Correo Argentino">Correo Argentino</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Crear seguimiento
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <p className="text-lg text-gray-800 font-medium">
                  ¡Tu seguimiento se ha creado exitosamente!
                </p>
                <button
                  onClick={onBack}
                  className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Volver al Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}