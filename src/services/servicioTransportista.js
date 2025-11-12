const {Transportista} = require('../model/index');

exports.obternerTransportistaPorID = async (idTransportista) => {

    try {

        const transportista = await Transportista.findOne({ 
        where: { idTransportista: idTransportista },
        attributes: ['idTransportista', 'codigo']
    });

        return transportista
        
    } catch {

        console.log("ALERT: No se puede obtener el transportista");

    }
    
}