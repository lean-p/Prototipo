import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

// Este componente define la campana de alertas del usuario

export default function Notificacion() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const token = localStorage.getItem('token');
        // Llamada a la API de alertas
        const response = await fetch('http://localhost:3000/api/alertas', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error('Error en la respuesta de la API de notificaciones');
        }
        const data = await response.json();
        console.log("Datos recibidos de la API:", data);
        setNotificaciones(data.alertas || []);

      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
        setNotificaciones([]);
      }
    };
    fetchNotificaciones();
  }, []);
  // Funcion para setear la bandera de notificacion leida
  const handleMarcarComoLeida = async (id) => {
    // Guardamos el estado original en caso de que la API falle
    const originalNotificaciones = [...notificaciones];
    setNotificaciones(notificacionesActuales => 
      notificacionesActuales.map(n => 
        n.idAlerta === id ? { ...n, leido: true } : n
      )
    );
    
    try {
      const token = localStorage.getItem('token');
      // Llamada a la api
      await fetch(`http://localhost:3000/api/alertas/${id}/leido`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Error al marcar como leída:", error);
      // Si la API falla, hacemos el rollback
      setNotificaciones(originalNotificaciones); 
    }
  };

  const unreadCount = Array.isArray(notificaciones) ? notificaciones.filter(n => !n.leido).length : 0;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
      >
        <Bell size={24} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-20">
          <div className="p-4 border-b font-semibold text-gray-800">Notificaciones</div>
          <ul className="max-h-96 overflow-y-auto">
            {notificaciones.length > 0 ? (
              notificaciones.map(notif => (
                <li key={notif.idAlerta} className={`p-4 border-b ${!notif.leido ? 'bg-blue-50' : ''}`}>
                  <p className="text-sm text-gray-700">{notif.texto}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleDateString('es-AR')}</p>
                    {!notif.leido && (
                      <button 
                        onClick={() => handleMarcarComoLeida(notif.idAlerta)} 
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        Marcar como leída
                      </button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-sm text-gray-500 text-center">No tienes notificaciones.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}