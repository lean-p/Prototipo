/* === ARCHIVO: src/components/ChartPanel.jsx === */
import React, { useState, useEffect } from 'react';
import { 
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, // Tipos de gráficos
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Colores para los gráficos de torta y barras (puedes personalizarlos)
const COLORS = ['#64bb61ff', '#d3c727ff', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'];

/**
 * Componente genérico para renderizar diferentes tipos de gráficos (Línea, Barra, Torta).
 * Se encarga de la carga de datos y el manejo de estados.
 *
 * @param {object} props
 * @param {string} props.urlEndpoint - URL de la API para obtener los datos del gráfico.
 * @param {string} props.title - Título a mostrar en el panel del gráfico.
 * @param {'line'|'bar'|'pie'|'donut'} props.type - Tipo de gráfico a renderizar.
 * @param {string} [props.dataKeyX] - Nombre de la clave de los datos para el eje X (para línea/barra).
 * @param {string} [props.dataKeyY] - Nombre de la clave de los datos para el eje Y (para línea/barra).
 * @param {string} [props.pieNameKey] - Nombre de la clave de los datos para el nombre en el gráfico de torta.
 * @param {string} [props.pieValueKey] - Nombre de la clave de los datos para el valor en el gráfico de torta.
 */
const API_URL = "http://localhost:3000"


export default function ChartPanel({ 
    urlEndpoint, 
    title, 
    type, 
    dataKeyX, 
    dataKeyY, 
    pieNameKey, 
    pieValueKey,
    colors = COLORS
}) {
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
                const formattedData = data.data.map(item => ({
                    ...item, // Mantenemos todas las claves (ej. dias_de_transito)
                    
                    // Si esta dataKey es la de la fecha (dataKeyX)
                    // Y el tipo de gráfico es 'line'
                    // Y el item TIENE esa clave...
                    ...(item[dataKeyX] && type === 'line' && {
                        // ...Reemplazamos el valor de esa clave (ej. "fecha")
                        // con la fecha formateada.
                        [dataKeyX]: new Date(item[dataKeyX]).toLocaleDateString('es-AR', {
                            day: 'numeric', 
                            month: '2-digit' 
                        }) // <-- Esto dará "22/09"
                    })
                }));
                // --- FIN DE LA LÓGICA NUEVA ---

                setData(formattedData);
               // setData(data.data);
            } catch (err) {
                console.error(`Error al cargar datos de ${urlEndpoint}:`, err);
                setError("No se pudieron cargar los datos del gráfico.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [urlEndpoint]); // El gráfico se recarga si el endpoint cambia

    // Renderizado condicional para estados de carga/error/sin datos
    let content;
    if (isLoading) {
        content = <div className="text-center text-gray-500 py-8">Cargando gráfico...</div>;
    } else if (error) {
        content = <div className="text-center text-red-500 py-8">{error}</div>;
    } else if (data.length === 0) {
        content = <div className="text-center text-gray-500 py-8">No hay datos para mostrar en este gráfico.</div>;
    } else {
        // Renderiza el gráfico según el 'type'
        switch (type) {
            case 'line':
                content = (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey={dataKeyX} fontSize="12px" />
                        <YAxis fontSize="12px" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey={dataKeyY} stroke="#8884d8" strokeWidth={2} dot={false} />
                    </LineChart>
                );
                break;
            case 'bar':
                content = (
                    <BarChart data={data} layout="vertical"> {/* Horizontal para replicar tu imagen */}
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis type="number" fontSize="12px" />
                        <YAxis type="category" dataKey={dataKeyX} fontSize="12px" width={200} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={dataKeyY} fill="#82ca9d" />
                    </BarChart>
                );
                break;
            case 'pie':
            case 'donut': // El donut es un tipo de pie chart con un agujero
                content = (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={type === 'donut' ? 60 : 0} // Agujero para donut
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey={pieValueKey}
                            nameKey={pieNameKey}
                            labelLine={false}
                            //label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Muestra nombre y porcentaje
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                );
                break;
            default:
                content = <div className="text-center text-red-500 py-8">Tipo de gráfico no soportado.</div>;
        }
    }

    return (
        <div className="bg-gray-800 shadow rounded-xl p-4 text-white"> {/* Estilo oscuro para imitar Grafana */}
            {title && (
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
            )}
            <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    {content}
                </ResponsiveContainer>
            </div>
        </div>
    );
}