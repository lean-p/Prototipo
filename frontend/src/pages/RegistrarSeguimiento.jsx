import { useState } from "react";
import { CheckCircle } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Registrar seguimiento
        </h1>

        {!success ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-600 mb-1">
                Número de tracking
              </label>
              <input
                type="text"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="Ej: DHL123456789"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Transportista</label>
              <select
                value={transportista}
                onChange={(e) => setTransportista(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="DHL">DHL</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Crear seguimiento
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-lg text-gray-700">
              ¡Tu seguimiento se ha creado exitosamente!
            </p>
            <button
              onClick={onBack}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Volver al Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
