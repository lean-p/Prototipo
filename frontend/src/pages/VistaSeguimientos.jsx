import { useState, useEffect, useCallback } from "react"; 
import { Package } from "lucide-react";
import Seguimientos from "./Seguimientos";
import ContextMenu from "./ContextMenu";
import { Link, Outlet, useNavigate, useOutletContext} from 'react-router-dom';
import Notificacion from "./notificacion";
import MenuAcciones from './MenuAcciones';


export default function VistaSeguimientos({ currentUser, onLogout, onRegistrar }) {

  const { setTitle } = useOutletContext();
  const [seguimientos, setSeguimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState({ success: null, error: null, loading: false });
    const navigate = useNavigate();
    const [page, setPage] = useState(1);       
    const [totalPages, setTotalPages] = useState(1); 
    const [totalSeguimientos, setTotalSeguimientos] = useState(0);

    useEffect(() => {
        setTitle('Mis Seguimientos');
    }, [setTitle]);

    const fetchSeguimientos = useCallback(async () => {
        const token = currentUser?.token; 
        if (!token) {
            setStatus({ loading: false, error: "Error de autenticación." });
            setLoading(false);
            return;
        }

        setStatus({ loading: true, error: null });
        setLoading(true);
        setError(null);

        try {
            const url = `/api/tracks/listTracks?page=${page}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();

            const seguimientosTraducidos = data.seguimientos.map(seguimiento => {
                let estadoTraducido = seguimiento.estadoActual; 
                switch (seguimiento.estadoActual) {
                  case "transit":
                    estadoTraducido = "En tránsito";
                    break;
                  case "delivered":
                    estadoTraducido = "Arribado"; 
                    break;
                }
                return { ...seguimiento, estado: estadoTraducido };
            }); 
            
            setSeguimientos(seguimientosTraducidos);
            setTotalSeguimientos(data.total);
            setTotalPages(data.totalPages);

        } catch (e) {
            setError(e.message);
            setStatus({ loading: false, error: e.message });
        } finally {
            setLoading(false);
            setStatus(s => ({ ...s, loading: false }));
        }
    }, [currentUser, page]); 

    useEffect(() => {
        fetchSeguimientos();
    }, [fetchSeguimientos]);


   const handleGenerarReporte = async () => {
    console.log('Iniciando generación de reporte...');
    const token = currentUser?.token;
    if (!token) {
      alert("Error de autenticación. Por favor, inicia sesión de nuevo.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/info/reporte', { 
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); 
        throw new Error(errorData.message || `Error del servidor: ${response.status}`);
      }

      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'seguimientos.csv'; 
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      console.log(`Nombre de archivo sugerido: ${filename}`);

      const blob = await response.blob();
      console.log('Blob recibido, tamaño:', blob.size);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); 
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log('Descarga iniciada y recursos limpiados.');

    } catch (error) {
      console.error('Error al generar o descargar el reporte:', error);
      alert(`No se pudo generar el reporte: ${error.message}`);
    }
  };

   // Traduccion de los estados de seguimiento para que sean legibles por el usuario
   const total = seguimientos.length;
   const enTransito = seguimientos.filter((s) => s.estado === "En tránsito").length;
   const arribados = seguimientos.filter((s) => s.estado === "Arribado").length;


  if (loading) {
     return <div className="min-h-screen flex items-center justify-center">Cargando datos...</div>;
   }

   if (error) {
     return <div className="min-h-screen flex items-center justify-center">Error al cargar los seguimientos: {error.message}</div>;
   }

   return (
     <div className="min-h-screen bg-gray-100 flex">

        <div className="flex-1 p-6 flex flex-col">
        {total > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white shadow rounded-xl p-4 text-center">
                <p className="text-gray-500">Total</p>
                <p className="text-2xl font-bold text-blue-600">{totalSeguimientos}</p>
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
            <div className="bg-white shadow rounded-xl p-4 text-black mb-6">
              <Seguimientos 
                  seguimientos={seguimientos} 
                  currentUser={currentUser}     
                  onRefreshData={fetchSeguimientos} 
              />
            </div>
            <div className="flex justify-center items-center gap-4 mt-2">
                        <button 
                            onClick={() => setPage(p => p - 1)}
                            disabled={page <= 1}
                            className="... (estilos de tu app) disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        
                        <span className="text-gray-700">
                            Página {page} de {totalPages}
                        </span>

                        <button 
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages}
                            className="... (estilos de tu app) disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
            <div className="flex justify-center mt-6">
              <button onClick={() => navigate('/registrar')}>
                Registrar Seguimiento
              </button>
              <button
                onClick={handleGenerarReporte}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium text-sm ml-4">
                Generar Reporte 
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Package className="w-20 h-20 text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 mb-2 text-center">
              Aún no tenés seguimientos cargados
            </p>
            <p className="text-gray-500 text-sm mb-6 text-center">
              Comienza registrando tu primer número de tracking
            </p>
            <button
              onClick={() => navigate('/registrar')}
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