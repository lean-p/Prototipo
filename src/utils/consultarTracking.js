require('dotenv').config({ path: 'config.env' });
exports.consultarTracking = async (nro_tracking, transportista) => {

    const username = '';
    const password = '';
    const credentialsDSV = Buffer.from(`${username}:${password}`).toString("base64");

    const DHL_SECRET_KEY = process.env.DHL_SECRET_KEY;
    const FX_CLIENT_ID = process.env.FX_CLIENT_ID;
    const FX_CLIENT_SECRET = process.env.FX_CLIENT_SECRET;

    const integrationsConfig = {

        'FedEx': {
            authUrl: 'https://apis.fedex.com/oauth/token',
            authBody: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: FX_CLIENT_ID,
                    client_secret: FX_CLIENT_SECRET
                }),
            authHeaders: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            baseUrl: 'https://apis.fedex.com/track/v1/trackingnumbers',
            method: 'POST', 
        },
        'DHL': {
            baseUrl: 'https://api-eu.dhl.com/track/shipments?trackingNumber=',
            headers:  {
                        "Content-Type": "application/json",
                        "DHL-API-Key": DHL_SECRET_KEY
                    },
            method: 'GET',
        }
    };    


    const config = integrationsConfig[transportista];

    if (!config) {
        throw new Error(`Error: El transportista '${transportista}' no está soportado.`);
    }

    

    if (config.baseUrl.includes('dhl')){
        try {

            const response = await fetch(config.baseUrl + nro_tracking, {
                method: config.method,
                headers: config.headers
            });
            const data = await response.json();
            const shipmentsArray = data.shipments;

            if (!shipmentsArray || shipmentsArray.length === 0) {
                throw new Error("No se encontraron datos de seguimiento para este número.");
            }

            const shipment = shipmentsArray[0];
            const lastEvent = shipment.events[0];


            const eventoMapeado = {
                // Mapeo de datos para la tabla Evento:
                fechaHora: lastEvent.timestamp,
                codigoPais: lastEvent.location.address.countryCode,
                estado: lastEvent.statusCode, 
                descripcion: lastEvent.description,
                
                
                // Mapeo de datos para el seguimiento
                ubicacion: shipment.status.location.address.addressLocality,
                origen: shipment.origin.address.addressLocality,
                destino: shipment.destination.address.addressLocality,
                nro_transporte: shipment.id,
                eventos: shipment.events,
                esFinalizado: (shipment.status.statusCode === 'delivered') 
            };

            return eventoMapeado;

        } catch (error) {
            console.log(error)
            throw new Error ('No se pueden mapear los datos de la respuesta')
        }
    }
    if (config.baseUrl.includes('fedex')){
        try {
            const auth = await fetch(config.authUrl, {
                method: config.method,
                headers: config.authHeaders,
                body: config.authBody
            });

            const authJson = await auth.json();
            const token = authJson.access_token;
            const body = {
                
                "includeDetailedScans": true,
                "trackingInfo": [
                    {
                    "trackingNumberInfo": {
                        "trackingNumber": nro_tracking
                    }
                    }
                ]
            }

            const hd = {

                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
            const response = await fetch(config.baseUrl, {
                    method: config.method,
                    headers: hd,
                    body: JSON.stringify(body)
                });

            const data = await response.json();
            
            const shipmentsArray = data.output.completeTrackResults[0].trackResults[0];
            console.log(shipmentsArray)
            const lastEvent = shipmentsArray.latestStatusDetail;
            const eventos = shipmentsArray.scanEvents;
            let estado;
            if (lastEvent.derivedCode === 'DL'){

                estado = 'delivered';

            } else {

                estado = 'transit';
            }

            if (!shipmentsArray || shipmentsArray.length === 0) {
                    throw new Error("No se encontraron datos de seguimiento para este número.");
            }

                const eventoMapeado = {
                    // Mapeo de datos para la tabla Evento:
                    fechaHora: shipmentsArray.dateAndTimes[0].dateTime,
                    codigoPais: lastEvent.scanLocation.countryCode,
                    estado: estado,
                    descripcion: lastEvent.description,
                    
                    
                    // Mapeo de datos para el seguimiento
                    ubicacion: lastEvent.scanLocation.city + ' - ' + lastEvent.scanLocation.countryName,
                    origen: shipmentsArray.originLocation.locationContactAndAddress.address.city + ' - ' + shipmentsArray.originLocation.locationContactAndAddress.address.countryName,
                    destino: shipmentsArray.lastUpdatedDestinationAddress.city + ' - ' + shipmentsArray.lastUpdatedDestinationAddress.countryName,
                    nro_transporte: data.output.completeTrackResults.trackingNumber,
                    eventos: eventos,
                    esFinalizado: (lastEvent.derivedCode === 'DL') 
                };


                return eventoMapeado;
            } catch (error) {
                console.error("--- ¡ERROR DE MAPEO DETECTADO! ---");
                console.error("El error original fue:", error.message);
                console.error("Línea que falla (aprox):", error.stack.split('\n')[1]);
                console.error("-----------------------------------");
                throw new Error ('No se pueden mapear los datos de la respuesta')
        }
    }
}
