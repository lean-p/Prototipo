const db = require('../model/dwmodel/index');

exports.obtenerCantidadDeSeguimientosPorEstado = async (userID) => {

    const consulta = `
            SELECT
                de.estado AS metric, 
                COUNT(fs.idSeguimiento) AS value
            FROM
                Fact_Seguimiento AS fs
            JOIN
                DimEstado AS de ON fs.idEstado = de.idEstado -- (Corregido a DimEstado)
            
            JOIN
                DimUsuario AS du ON fs.userID = ${userID}
            
            GROUP BY
            de.estado
            ORDER BY
            value DESC;
        `;

    const [resultados] = await db.sequelize.query(consulta, { bind: [userID] });
    return resultados;
}


exports.obtenerCantidadDeSeguimientosPorCiudad = async (userID) => {

    const consulta = `
            SELECT
                du.nombre AS Ciudad,
                COUNT(fs.idSeguimiento) AS value
            FROM
                fact_Seguimiento AS fs -- Respetamos tu nombre de tabla
            JOIN
                DimUbicacion AS du ON fs.idUbicacion = du.idUbicacion -- Respetamos tu nombre de tabla

            JOIN
                DimUsuario AS dus ON fs.userID = ${userID}

            GROUP BY
                du.nombre
            ORDER BY
                value DESC
        `;

    const [resultados] = await db.sequelize.query(consulta, { bind: [userID] });
    return resultados;
}


exports.obtenerSeguimientosPorVendedor = async (userID) => {

    const consulta = `
            SELECT
                V.vendedor AS vendedor,
                COUNT(DISTINCT fs.idSeguimiento) AS Total
            FROM
                Fact_Seguimiento AS fs
            INNER JOIN 
                DimDetalle AS D ON fs.idDetalle = D.idDetalle
            INNER JOIN 
                DimVendedor AS V ON D.idVendedor = V.idVendedor
                
            INNER JOIN
                DimUsuario AS du ON fs.userID = ${userID}

            GROUP BY
                V.vendedor
            ORDER BY
                Total DESC;
        `;

    const [resultados] = await db.sequelize.query(consulta, { bind: [userID] });
    return resultados;
}



exports.obtenerCostoDeFletePorTransportista = async (userID) => {

    const consulta = `
            SELECT
                T.nombre AS transportista,
                SUM(D.costoFlete) AS costo_total_flete
            FROM
                Fact_Seguimiento AS fs
                -- Unimos el Hecho con el Detalle (para sacar el costo)
            INNER JOIN DimDetalle AS D
                    ON fs.idDetalle = D.idDetalle

            INNER JOIN DimTransportista AS T
                    ON fs.idTransportista = T.idTransportista
            INNER JOIN
                DimUsuario AS du ON fs.userID = ${userID}
            GROUP BY
                T.nombre
            ORDER BY
                costo_total_flete DESC;
        `;

    const [resultados] = await db.sequelize.query(consulta, { bind: [userID] });
    return resultados;
}

exports.obtenerCumplimientoDePlazos = async (userID) => {

    const consulta = `
            SELECT
                CASE
                    
                    WHEN ubicacion_destino.region = 'América' AND DATEDIFF(fecha_fin.fecha, fecha_inicio.fecha) <= 5 THEN 'Aceptable (América)'
                        

                    WHEN ubicacion_destino.region = 'Asia' AND DATEDIFF(fecha_fin.fecha, fecha_inicio.fecha) <= 8 THEN 'Aceptable (Asia)'
                        
            
                    WHEN ubicacion_destino.region = 'Oceania' AND DATEDIFF(fecha_fin.fecha, fecha_inicio.fecha) <= 10 THEN 'Aceptable (General)'
                        

                    ELSE 'Fuera de Rango' 
                    
                END AS metric, 
                COUNT(fs.idSeguimiento) AS value 
            FROM
                Fact_Seguimiento fs 
            JOIN
                dimFecha fecha_inicio ON fs.idFechaInicial = fecha_inicio.idFecha
            LEFT JOIN 
                dimFecha fecha_fin ON fs.idFecha = fecha_fin.idFecha 
            JOIN 
                dimUbicacion ubicacion_destino ON fs.idUbicacion = ubicacion_destino.idUbicacion
            JOIN
                DimUsuario AS du ON fs.userID = ${userID}
            GROUP BY
                metric 
            ORDER BY
                CASE metric 
                    WHEN 'Aceptable (América)' THEN 1
                    WHEN 'Aceptable (Asia)' THEN 2
                    WHEN 'Aceptable (General)' THEN 3
                    WHEN 'En Curso' THEN 4
                    WHEN 'Fuera de Rango' THEN 5
                    ELSE 6
                END;`;

    const [resultados] = await db.sequelize.query(consulta, { bind: [userID] });
    return resultados;
}

exports.obtenerTendenciaDeDemoraPorEnvio = async (userID) => {

    const consulta = `
            SELECT
            
            CAST(F_Fin.fecha AS DATETIME) AS time,
            
            
            DATEDIFF(F_Fin.fecha, F_Inicio.fecha) AS Transito
            FROM
                Fact_Seguimiento AS fs
            INNER JOIN DimFecha AS F_Inicio
                ON fs.idFechaInicial = F_Inicio.idFecha
            INNER JOIN DimFecha AS F_Fin
                ON fs.idFecha = F_Fin.idFecha
            INNER JOIN DimEstado AS E
                ON fs.idEstado = E.idEstado
            JOIN
                DimUsuario AS du ON fs.userID = ${userID}
            WHERE
                E.estado = 'delivered' OR E.estado = 'Arribado'
            ORDER BY
                time ASC;
        `;

    const [resultados] = await db.sequelize.query(consulta, { bind: [userID] });
    return resultados;
}











