const servicioSeguimiento = require('../services/servicioSeguimiento');

exports.registrar = async (req, res) => {

    const {nro_tracking, transportista} = req.body;

    if (!nro_tracking || !transportista){

        console.warn('WARNING - 400: Campos incompletos');
        
        return res.status(400).json({

            mensaje:'Los campos Numero de tracking y Transportista son obligatorios'

        });
    }

    const userID_FK = req.userID;

    if (!userID_FK){

        console.warn('WARNING - 400: Usuario no identificado')

        return res.status(400).json({

            mensaje: 'Usuario no identificado'

        });
    }

    const datosSeguimiento = {
        nro_tracking,
        transportista: transportista,
        userID_FK: userID_FK,
    };


    try {
        const seguimiento = await servicioSeguimiento.registrarSeguimiento(datosSeguimiento);

        return res.status(200).json({

            mensaje: 'Seguimiento creado con exito',
            idSeguimiento: seguimiento.idSeguimiento

        });
    } catch (error) {

        return res.status(409).json({

            mensaje: error.message

        });
    }
};

exports.listar = async (req, res) => {

    userID = req.userID

    if (!userID){

        console.warn('WARNING - 400: Usuario no identificado')

        return res.status(400).json({

            mensaje: 'Usuario no identificado'

        });
    }

    try {

        const seguimientos = await servicioSeguimiento.obtenerTodosLosSeguimientos(userID);

        return res.status(200).json({

            seguimientos: seguimientos

        });

    } catch (error) {
        return res.status(409).json({

            mensaje: error.message

        });
    }
}

exports.eliminar = async (req, res) => {

    try {
        //Se obtienen parametros de usuario y id de seguimiento
        const { id } = req.params;
        userID = req.userID

        await servicioSeguimiento.eliminarSeguimiento(id, userID);

        res.status(200).json({ message: "Seguimiento borrado exitosamente" });

    } catch (error) {
        console.error("Error en el controlador:", error.message);
        
        if (error.message === "Permiso denegado") {
            return res.status(403).json({ error: "No tienes permiso para borrar este seguimiento." });
        }
        
        res.status(500).json({ error: "Error interno al borrar el seguimiento." });
    }
}

exports.detalleSeguimiento = async (req, res) => {

    const {id} = req.params;

    try {

        const detalles = await servicioSeguimiento.obtenerDetallesDeSeguimiento(id);

        return res.status(200).json({

            detalles: detalles

        });
    } catch (error) {

        console.error("Error al obtener seguimiento por ID:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

exports.listarSeguimientosPaginados = async (req, res) => {
    try {
        const userID = req.user.userID;
        const page = parseInt(req.query.page) || 1;
        const limit = 10; 

        // Llamada la funcion que obtiene los seguimientos paginados para mostrarlos en el frontend
        const dataPaginada = await servicioSeguimiento.obtenerSeguimientosPaginados(userID, page, limit);

        res.status(200).json(dataPaginada);

    } catch (error) {
        return res.status(409).json({

            mensaje: error.message

        });
    }
};