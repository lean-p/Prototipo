import { useState } from "react";
import { Package } from "lucide-react";
import Seguimientos from "./Seguimientos";
import ContextMenu from "./ContextMenu";

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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Barra lateral con logo */}
      <ContextMenu />

      {/* Contenido principal */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Título fuera de la caja */}
        <div className="mb-6">
          <h1 className="text-2xl font-poppins text-gray-800">Mis Seguimientos</h1>
        </div>

        {total > 0 ? (
          <>
            {/* Resumen */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white shadow rounded-xl p-4 text-center">
                <p className="text-gray-500">Total</p>
                <p className="text-2xl font-bold text-blue-600">{total}</p>
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
            <div className="bg-white shadow rounded-xl overflow-hidden p-4 text-black mb-6">
              <Seguimientos seguimientos={seguimientos} />
            </div>

            {/* Botón centrado */}
            <div className="flex justify-center">
              <button
                onClick={onRegistrar}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Registrar Seguimiento
              </button>
            </div>
          </>
        ) : (
          /* Caso sin seguimientos - centrado */
          <div className="flex-1 flex flex-col items-center justify-center">
            <Package className="w-20 h-20 text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 mb-2 text-center">
              Aún no tenés seguimientos cargados
            </p>
            <p className="text-gray-500 text-sm mb-6 text-center">
              Comienza registrando tu primer número de tracking
            </p>
            <button
              onClick={onRegistrar}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Registrar Seguimiento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}