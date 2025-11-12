/* === ARCHIVO: src/components/Dashboard.jsx === */
import React from 'react';
import ChartPanel from './ChartPanel';       
import NavigableTable from './TablaNavegagle'; 

export default function Dashboard() {

    const COLORES_GRAFICO_1_AMARILLO = [
    '#29c924ff', // Verde (index 0)
    '#d3c727ff', // Amarillo (index 1)
    '#E53E3E', 
    '#ff8042'
];

    const COLORES_GRAFICO_2_ROJO = [
        '#29c924ff', // Verde (index 0)
        '#E53E3E',   // ¡Rojo! (index 1) (Usando un rojo de Tailwind como ejemplo)
        '#E53E3E', 
        '#ff8042'
    ];

    // Función para manejar el click en las filas de la tabla
    const handleCiudadRowClick = (ciudadData) => {
        alert(`Has hecho clic en la ciudad: ${ciudadData.ciudad}. Puedes redirigir o abrir un modal aquí.`);
    };

    const handleTransportistaRowClick = (transportistaData) => {
        alert(`Has hecho clic en el transportista: ${transportistaData.transportista}.`);
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white"> {/* Fondo oscuro */}
            

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

                <ChartPanel 
                    urlEndpoint="/api/dashboard/seguimientos-por-estado" // Asume que este endpoint devuelve [{estado: 'Delivered', value: 10}, ...]
                    title="Cantidad de seguimientos por estado"
                    type="donut" 
                    pieNameKey="metric"
                    pieValueKey="value"
                    colors={COLORES_GRAFICO_1_AMARILLO}
                />               
                <div className="lg:col-span-2">
                <NavigableTable 
                    urlEndpoint="/api/dashboard/seguimientos-por-ciudad" 
                    title="Seguimientos por ciudad"
                    columns={[ // Definimos las columnas de la tabla
                        { key: 'Ciudad', header: 'Ciudad' },
                        { key: 'value', header: 'Value', align: 'right' }
                    ]}
                    onRowClick={handleCiudadRowClick} // Pasamos la función de click
                />
                </div>
                   <div className="lg:col-span-2">
                <ChartPanel 
                    urlEndpoint="/api/dashboard/seguimientos-por-vendedor" 
                    title="Envíos por vendedor"
                    type="bar" 
                    dataKeyX="vendedor" // Asume que el backend devuelve {vendedor: 'SAMSUNG', total_envios: 5}
                    dataKeyY="Total"
                />
                </div>

                <ChartPanel 
                    urlEndpoint="/api/dashboard/cumplimiento-de-plazos" 
                    title="Cumplimiento de plazos"
                    type="donut" // Tu imagen es un donut
                    pieNameKey="metric" // Asume que el backend devuelve {estado: 'Aceptable', cantidad: 94}
                    pieValueKey="value"
                    colors={COLORES_GRAFICO_2_ROJO}
                />
                <NavigableTable 
                    urlEndpoint="/api/dashboard/costo-por-transportista" // Asume este endpoint devuelve [{transportista: 'DHL', costo_total_flete: 1015}, ...]
                    title="Costo total de fletes por transportista"
                    columns={[
                        { key: 'transportista', header: 'Transportista' },
                        { key: 'costo_total_flete', header: 'Costo total flete', align: 'right' }
                    ]}
                    onRowClick={handleTransportistaRowClick}
                />
            <div className="lg:col-span-2">
                <ChartPanel 
                    urlEndpoint="/api/dashboard/tendencia-de-envios" 
                    title="Tendencia de demora por envío"
                    type="line" 
                    dataKeyX="time" // Asume que el backend devuelve {fecha: '2023-10-20', dias_de_transito: 2}
                    dataKeyY="Transito" 
                />
            </div>
            </div> 
        </div>
    );
}