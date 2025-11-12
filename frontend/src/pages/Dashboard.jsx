import React from 'react';
import ChartPanel from './ChartPanel';       
import NavigableTable from './TablaNavegagle'; 

export default function Dashboard() {

    //Definicion de paleta de colores para los graficos torta
    const COLORES_GRAFICO_ESTADO = [
        '#29c924ff',
        '#d3c727ff',
        '#E53E3E', 
        '#ff8042'
    ];

    const COLORES_GRAFICO_PLAZOS = [
        '#29c924ff',
        '#E53E3E',
        '#d3c727ff', 
        '#ff8042'
    ];
    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

                <ChartPanel 
                    urlEndpoint="/api/dashboard/seguimientos-por-estado" 
                    title="Cantidad de seguimientos por estado"
                    type="donut" 
                    pieNameKey="metric"
                    pieValueKey="value"
                    colors={COLORES_GRAFICO_ESTADO}
                />               
                <div className="lg:col-span-2">
                <NavigableTable 
                    urlEndpoint="/api/dashboard/seguimientos-por-ciudad" 
                    title="Seguimientos por ciudad"
                    // Definimos las columnas de la tabla
                    columns={[ 
                        { key: 'Ciudad', header: 'Ciudad' },
                        { key: 'value', header: 'Value', align: 'right' }
                    ]}
                />
                </div>
                   <div className="lg:col-span-2">
                <ChartPanel 
                    urlEndpoint="/api/dashboard/seguimientos-por-vendedor" 
                    title="Envíos por vendedor"
                    type="bar" 
                    dataKeyX="vendedor"
                    dataKeyY="Total"
                />
                </div>

                <ChartPanel 
                    urlEndpoint="/api/dashboard/cumplimiento-de-plazos" 
                    title="Cumplimiento de plazos"
                    type="donut"
                    pieNameKey="metric"
                    pieValueKey="value"
                    colors={COLORES_GRAFICO_PLAZOS}
                />
                <NavigableTable 
                    urlEndpoint="/api/dashboard/costo-por-transportista"
                    title="Costo total de fletes por transportista"
                    columns={[
                        { key: 'transportista', header: 'Transportista' },
                        { key: 'costo_total_flete', header: 'Costo total flete', align: 'right' }
                    ]}
                />
            <div className="lg:col-span-2">
                <ChartPanel 
                    urlEndpoint="/api/dashboard/tendencia-de-envios" 
                    title="Tendencia de demora por envío"
                    type="line" 
                    dataKeyX="time"
                    dataKeyY="Transito" 
                />
            </div>
            </div> 
        </div>
    );
}