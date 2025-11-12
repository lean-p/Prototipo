// src/components/SeguimientoDetalle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Un componente simple para el ítem del timeline
const TimelineItem = ({ evento, esUltimo }) => (
  <div className="relative pl-8">
    {/* La línea vertical del timeline */}
    {!esUltimo && <div className="absolute left-3 top-3 h-full w-0.5 bg-gray-300"></div>}
    {/* El punto del timeline */}
    <div className="absolute left-0 top-2 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center ring-4 ring-white">
      <div className="h-2 w-2 bg-white rounded-full"></div>
    </div>
    {/* El contenido del evento */}
    <div className="ml-4">
      <p className="font-semibold text-gray-800">{evento.descripcion}</p>
      <p className="text-sm text-gray-600">{evento.ubicacion}</p>
      <p className="text-xs text-gray-400">{new Date(evento.fechaHora).toLocaleString()}</p>
    </div>
  </div>
);

export default function SeguimientoDetalle(currentUser, onLogout) {
  const { id } = useParams(); // Obtiene el 'id' de la URL
  const [seguimiento, setSeguimiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useLocation()
  useEffect(() => {
    const fetchDetalle = async () => {
      const token = currentUser.currentUser.token;
      if (!token) {
        setError(new Error('No autenticado.'));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/tracks/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Error al obtener los datos');

        const data = await response.json();
        setSeguimiento(data.detalles[0]);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [id]); // El efecto se ejecuta si el ID de la URL cambia

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!seguimiento) return <div>No se encontró el seguimiento.</div>;

  return (
    
    
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/seguimientos" className="flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft size={18} className="mr-2" /> Volver a Seguimientos
        </Link>
        
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">{seguimiento.nro_tracking}</h1>
          <div className="text-black grid grid-cols-3 gap-4 mt-4 text-sm">
            <div><span className="font-semibold">Transportista:</span> {state.transportista}</div>
            <div><span className="font-semibold">Estado:</span> {state.estado}</div>
            <div><span className="font-semibold">Ubicación Actual:</span> {seguimiento.ubicacionActual}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Historial de Eventos</h2>
          <div className="space-y-8">
            {seguimiento.eventos?.map((evento, index) => {
              return (
              <TimelineItem 
                key={evento.idEvento} 
                evento={evento} 
                esUltimo={index === seguimiento.eventos.length - 1} 
              />);
            })}
          </div>
        </div>
      </div>
    </div>
  );
}