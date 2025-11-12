import React from 'react';

export default function TimelineItem({ evento, esUltimo }) {

   // Funcion para formatear la fecha de forma legible para el usuario

    const formatearFecha = (fechaString) => {
        if (!fechaString) {
            return 'Fecha no disponible';
        }
        const fecha = new Date(fechaString);
        if (isNaN(fecha)) {
            return 'Fecha inválida';
        }
        return fecha.toLocaleString('es-AR', 
            {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    ) + ' hs';
    };
  return (
    <div className="relative flex items-start pl-10">
      {!esUltimo && (
        <div className="absolute left-4 top-5 h-full w-0.5 bg-gray-200"></div>
      )}
      <div className="absolute left-1.5 top-3 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 ring-8 ring-white">
        <div className="h-2 w-2 rounded-full bg-white"></div>
      </div>
      <div className="flex-1 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-gray-800">{evento.descripcion}</p>
          <p className="text-xs text-gray-500 mt-1 sm:mt-0">
            {new Date(evento.fecha).toLocaleDateString('es-AR')}
          </p>
        </div>
        <p className="text-sm text-gray-600 mt-1">{evento.ubicacion}</p>
      </div>
    </div>
  );
}