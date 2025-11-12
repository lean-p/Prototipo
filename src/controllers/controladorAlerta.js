const servicioAlerta = require('../services/servicioAlerta')
const {Alerta }= require('../model/index');
const { Op } = require('sequelize');
exports.alertar = async (req, res) => {

    userID_FK = req.userID;

    try {

        const alertas = await servicioAlerta.listarAlertasPorUsuario(userID_FK);

        return res.status(200).json({

            alertas: alertas

        });

    } catch (error) {

        return res.status(409).json({

            mensaje: error.message

        });
    };

}

exports.leido = async (req, res) => {

    const {id} = req.params

    const notificacion = await Alerta.findByPk(id);
    console.log(id);

    try{
        if (notificacion) {
        notificacion.leido = true;
        await notificacion.save();
        res.status(200).json({ message: 'Notificación marcada como leída.' });
        } else {
        res.status(404).json({ message: 'Notificación no encontrada.' });
        }
    } catch (error) {
        throw new Error ('No se pudo notificar', error.message)
    };
}