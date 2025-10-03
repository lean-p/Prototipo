import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net";

export default function Seguimientos({ seguimientos }) {
  const tableRef = useRef(null);

  useEffect(() => {
    const table = $(tableRef.current).DataTable({
      paging: true,
      searching: true,
      info: false,
      responsive: true,
    });

    return () => {
      table.destroy(); // limpiar al desmontar
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
        </tr>
      </thead>
      <tbody>
        {seguimientos.map((s) => (
          <tr key={s.id}>
            <td>{s.tracking}</td>
            <td>{s.transportista}</td>
            <td>{s.ubicacion}</td>
            <td>{s.estado}</td>
            <td>{s.fecha}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

