import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net";
import { Link } from 'react-router-dom';
import MenuAcciones from './MenuAcciones';

// Compoenente que muestra la tabla de cada seguimiento. Llama al menu de acciones que se pueden realizar sobre cada seguimiento

export default function Seguimientos({ seguimientos, currentUser, onRefreshData }) {
  const tableRef = useRef(null);

  useEffect(() => {
    const table = $(tableRef.current).DataTable({
      paging: true,
      searching: true,
      info: false,
      responsive: true,
      columnDefs: [
        { targets: 5, orderable: false, searchable: false } 
      ]
    });

    return () => {
      table.destroy();
    };
  }, [seguimientos]);

  return (
    <table ref={tableRef} className="display stripe hover w-full">
      <thead className="bg-gray-200 text-gray-700">
        <tr>
          <th>Tracking</th>
          <th>Transportista</th>
          <th>Ubicación</th>
          <th>Estado</th>
          <th>Último evento</th>
          <th className="text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {seguimientos.map((s) => (
          <tr key={s.idSeguimiento}>
            <td><Link 
                to={`/seguimiento/${s.idSeguimiento}`} 
                className="text-blue-600 hover:underline font-medium"
                state={{ 
                  estado: s.estado, 
                  transportista: s.transportista.nombre,
                }}
              >
                {s.nro_tracking}
              </Link>
            </td>
            <td>{s.transportista.nombre}</td>
            <td>{s.ubicacionActual}</td>
            <td>{s.estado}</td>
            <td>{new Date(s.fechaInicio).toLocaleDateString('es-AR')}</td>
            <td className="text-right">
                <MenuAcciones 
                    currentUser={currentUser}
                    seguimiento={s}
                    onUploadSuccess={onRefreshData}
                    onDeleteSuccess={onRefreshData}
                />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

