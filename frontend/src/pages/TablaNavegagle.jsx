import React, { useState, useEffect } from 'react';


// Componente para renderizar una tabla con filas que se muestra en el dashboard
 

const API_URL = "http://localhost:3000"

export default function NavigableTable({ title, urlEndpoint, columns, onRowClick }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL + urlEndpoint, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });;
                const data = await response.json();
                setData(data.data);
            } catch (err) {
                console.error(`Error al cargar datos de ${urlEndpoint}:`, err);
                setError("No se pudieron cargar los datos de la tabla.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [urlEndpoint]);

    let content;
    if (isLoading) {
        content = <div className="text-center text-gray-500 py-8">Cargando datos...</div>;
    } else if (error) {
        content = <div className="text-center text-red-500 py-8">{error}</div>;
    } else if (data.length === 0) {
        content = <div className="text-center text-gray-500 py-8">No hay datos para mostrar en la tabla.</div>;
    } else {
        content = (
            <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700"> {/* Divisor oscuro */}
                    <thead className="bg-gray-700"> {/* Encabezado oscuro */}
                        <tr>
                            {columns.map((col, index) => (
                                <th 
                                    key={index} 
                                    className={`px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${col.align === 'right' ? 'text-right' : ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {data.map((row, rowIndex) => (
                            <tr 
                                key={rowIndex} 
                                className={`
                                    ${onRowClick ? 'cursor-pointer hover:bg-gray-700' : ''} 
                                    ${rowIndex % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'} {/* Alternar filas oscuro/más oscuro */}
                                `}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                            >
                                {columns.map((col, colIndex) => (
                                    <td 
                                        key={colIndex} 
                                        className={`px-4 py-2 whitespace-nowrap text-sm text-gray-300 ${col.align === 'right' ? 'text-right' : ''}`}
                                    >
                                        {row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 shadow rounded-xl p-4 text-white">
            {title && (
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
            )}
            {content}
        </div>
    );
}