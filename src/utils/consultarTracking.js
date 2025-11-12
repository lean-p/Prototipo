exports.consultarTracking = async (nro_tracking, transportista) => {

    const username = '';
    const password = '';
    const credentialsDSV = Buffer.from(`${username}:${password}`).toString("base64");
    const integrationsConfig = {
    // 🚨 Clave 1: DSV
        'FedEx': {
            authUrl: 'https://apis.fedex.com/oauth/token',
            authBody: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: 'l70cfd4b08af95450fada615ca95188236',
                    client_secret: '5ef45a33e7a64265a95d8634ce9f5833'
                }),
            authHeaders: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            baseUrl: 'https://apis.fedex.com/track/v1/trackingnumbers',
            method: 'POST', 
        },
        // 🚨 Clave 2: DHL
        'DHL': {
            baseUrl: 'https://api-eu.dhl.com/track/shipments?trackingNumber=',
            headers:  {
                        "Content-Type": "application/json",
                        "DHL-API-Key": "g2wbGku5ZnswWMJ0S36QAJPtK7uL9Igs"
                    },
            method: 'GET',
        },
        // Clave 3: UPS
        'UPS': {
            // ... (otros datos de configuración)
        },
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
            
            // --- LÓGICA DE MAPEO ---
            const shipmentsArray = data.shipments;

            if (!shipmentsArray || shipmentsArray.length === 0) {
                throw new Error("No se encontraron datos de seguimiento para este número.");
            }

            const shipment = shipmentsArray[0];
            const lastEvent = shipment.events[0]; // El evento más reciente

            // 🚨 1. CREACIÓN DEL OBJETO MAESTRO MAPEADO 🚨
            const eventoMapeado = {
                // Mapeo de datos para la tabla Evento:
                fechaHora: lastEvent.timestamp,
                codigoPais: lastEvent.location.address.countryCode,
                estado: lastEvent.statusCode, 
                descripcion: lastEvent.description,
                
                
                // Datos Maestros (necesarios para la primera inserción del Seguimiento):
                ubicacion: shipment.status.location.address.addressLocality,
                origen: shipment.origin.address.addressLocality,
                destino: shipment.destination.address.addressLocality,
                nro_transporte: shipment.id,
                eventos: shipment.events,
                esFinalizado: (shipment.status.statusCode === 'delivered') 
            };

            // 2. RETORNO CORRECTO: Devolvemos SOLO el objeto mapeado
            return eventoMapeado;

        } catch (error) {
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
            const lastEvent = shipmentsArray.latestStatusDetail; // El evento más reciente
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

            

                // 🚨 1. CREACIÓN DEL OBJETO MAESTRO MAPEADO 🚨
                const eventoMapeado = {
                    // Mapeo de datos para la tabla Evento:
                    fechaHora: shipmentsArray.dateAndTimes[0].dateTime,
                    codigoPais: lastEvent.scanLocation.countryCode,
                    estado: estado,
                    descripcion: lastEvent.description,
                    
                    
                    // Datos Maestros (necesarios para la primera inserción del Seguimiento):
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

//const resp = await this.consultarTracking('4574596261', 'DHL');
//console.log(resp)