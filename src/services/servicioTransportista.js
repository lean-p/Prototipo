//const Transportista = require('../model/Transportista');
const {Transportista} = require('../model/index');

exports.obternerTransportistaPorID = async (idTransportista) => {

    try {

        const transportista = await Transportista.findOne({ 
        where: { idTransportista: idTransportista },
        attributes: ['idTransportista', 'codigo'] // Solo traemos el ID
    });

        return transportista
        
    } catch {

        console.log("ALERT: No se puede obtener el transportista");

    }
    
}