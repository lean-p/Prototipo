const servicioDashboard = require('../services/servicioDashboard');

exports.obtenerCantidadDeSeguimientosPorEstado = async (req, res) => {
    userID = req.user.userID;

    try {

        const data = await servicioDashboard.obtenerCantidadDeSeguimientosPorEstado(userID);
        return res.status(200).json({

            data: data

        });
    } catch (error) {
        console.error(`Error en ReporteController: ${error.message}`);
        res.status(500).json({ error: "Error interno al generar el reporte." })
    }
    

}

exports.obtenerCantidadDeSeguimientosPorCiudad = async (req, res) => {

    userID = req.user.userID;

    try {

        const data = await servicioDashboard.obtenerCantidadDeSeguimientosPorCiudad(userID);
        return res.status(200).json({

            data: data

        });
    } catch (error) {

        console.error(`Error en ReporteController: ${error.message}`);
        res.status(500).json({ error: "Error interno al generar el reporte." })
    }

}

exports.obtenerSeguimientosPorVendedor = async (req, res) => {

    userID = req.user.userID;

    try {

        const data = await servicioDashboard.obtenerSeguimientosPorVendedor(userID);
        return res.status(200).json({

            data: data

        });
    } catch (error) {

        console.error(`Error en ReporteController: ${error.message}`);
        res.status(500).json({ error: "Error interno al generar el reporte." })
    }

}

exports.obtenerCostoDeFletePorTransportista = async (req, res) => {

    userID = req.user.userID;

    try {

        const data = await servicioDashboard.obtenerCostoDeFletePorTransportista(userID);
        return res.status(200).json({

            data: data

        });
    } catch (error) {

        console.error(`Error en ReporteController: ${error.message}`);
        res.status(500).json({ error: "Error interno al generar el reporte." })
    }

}


exports.obtenerCumplimientoDePlazos = async (req, res) => {

    userID = req.user.userID;

    try {

        const data = await servicioDashboard.obtenerCumplimientoDePlazos(userID);
        return res.status(200).json({

            data: data

        });
    } catch (error) {

        console.error(`Error en ReporteController: ${error.message}`);
        res.status(500).json({ error: "Error interno al generar el reporte." })
    }

}

exports.obtenerTendenciaDeDemoraPorEnvio = async (req, res) => {

    userID = req.user.userID;

    try {

        const data = await servicioDashboard.obtenerTendenciaDeDemoraPorEnvio(userID);
        return res.status(200).json({

            data: data

        });
    } catch (error) {

        console.error(`Error en ReporteController: ${error.message}`);
        res.status(500).json({ error: "Error interno al generar el reporte." })
    }

}