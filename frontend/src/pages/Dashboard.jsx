import { useState } from "react";
import { Package } from "lucide-react";
import Seguimientos from "./Seguimientos";

export default function Dashboard({ onRegistrar }) {
  const [seguimientos] = useState([
    {
      id: 1,
      tracking: "DHL123456",
      transportista: "DHL",
      ubicacion: "Buenos Aires, Argentina",
      estado: "En tránsito",
      fecha: "2025-10-01",
    },
    {
      id: 2,
      tracking: "DHL654321",
      transportista: "DHL",
      ubicacion: "Madrid, España",
      estado: "Arribado",
      fecha: "2025-09-28",
    },
  ]);

  const total = seguimientos.length;
  const enTransito = seguimientos.filter(s => s.estado === "En tránsito").length;
  const arribados = seguimientos.filter(s => s.estado === "Arribado").length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Mis Seguimientos</h1>

      {total > 0 ? (
        <>
          {/* Resumen */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white shadow rounded-xl p-4 text-center">
              <p className="text-gray-500">Total</p>
              <p className="text-2x1 font-bold text-blue-600">{total}</p>
            </div>
            <div className="bg-white shadow rounded-xl p-4 text-center">
              <p className="text-gray-500">En tránsito</p>
              <p className="text-2xl font-bold text-yellow-600">{enTransito}</p>
            </div>
            <div className="bg-white shadow rounded-xl p-4 text-center">
              <p className="text-gray-500">Arribados</p>
              <p className="text-2xl font-bold text-green-600">{arribados}</p>
            </div>
          </div>

          {/* Tabla con DataTables */}
          <div className="bg-white shadow rounded-xl overflow-hidden p-4 text-black">
            <Seguimientos seguimientos={seguimientos} />
          </div>
          <button
            onClick={onRegistrar}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition mt-8"
          >
            Registrar Seguimiento
          </button>
        </>
      ) : (
        /* Caso sin seguimientos */
        <div className="flex flex-col items-center justify-center mt-20">
          <Package className="w-20 h-20 text-gray-400 mb-4" />
          <p className="text-lg text-gray-600 mb-2">
            Aún no tenés seguimientos cargados
          </p>
          <button
            onClick={onRegistrar}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Registrar Seguimiento
          </button>
        </div>
      )}
    </div>
  );
}

