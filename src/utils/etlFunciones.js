const { DimFecha, DimUbicacion } = require('../model/dwmodel/index'); 
//Compoenente auxiliar que contiene las funciones complementarias al ETL

exports.obtenerOCrearDimFecha = async (fechaInput) => {
    if (!fechaInput) {
        return null; 
    }

    try {
        const fechaObjeto = new Date(fechaInput);

        if (isNaN(fechaObjeto.getTime())) {
            console.warn(`Fecha inválida recibida: ${fechaInput}`);
            return null;
        }

        const fechaCompleta = fechaObjeto.toISOString().split('T')[0];
        const anio = fechaObjeto.getFullYear();
        const mes = fechaObjeto.getMonth() + 1;
        const dia = fechaObjeto.getDate();

        const [dimFecha, fueCreadaFecha] = await DimFecha.findOrCreate({
            where: {
                fecha: fechaCompleta 
            },
            defaults: {
                fecha: fechaCompleta,
                anio: anio,
                mes: mes,
                dia: dia
            }
        });

        if (fueCreadaFecha) {
            console.log(`Nueva fecha creada en DimFecha: ${fechaCompleta}`);
        }

        return dimFecha.idFecha;

    } catch (error) {
        console.error(`Error procesando fecha ${fechaInput} para DimFecha:`, error);
        return null; 
    }
}

function determinarRegion(nombre) {

        const nombreLower = nombre.toLowerCase();
        if (nombreLower.includes('usa') || nombreLower.includes('argentina') || nombreLower.includes('panama')) {
            return 'America';
        } else if (nombreLower.includes('vietnam') || nombreLower.includes('china') || nombreLower.includes('korea')) {
            return 'Asia';
        } else if (nombreLower.includes('españa') || nombreLower.includes('germany')) { 
            return 'Europa';
        } else if (nombreLower.includes('australia') || nombreLower.includes('new zealand')) {
            return 'Oceania'; 
        } else {
            return 'Africa';
        }
}

exports.obtenerOCrearDimUbicacion = async (ubicacion) =>{

    if (!ubicacion) {
        return null; 
    }
    try{    

        const regionDeterminada = determinarRegion(ubicacion); 
        
        const [dimUbicacion, fueCreadaUbicacion] = await DimUbicacion.findOrCreate({

        where: {
            nombre: ubicacion
        },
        defaults: {
            nombre: ubicacion,
            region: regionDeterminada
        }
        });
        if (fueCreadaUbicacion) {
            console.log(`Nueva estado creado en DimEstado: ${ubicacion}`);
        };
    
        return dimUbicacion.idUbicacion;
    } catch (error){

        console.error(`Error procesando ubicacion ${ubicacion} para DimFecha:`, error);
        return null;

    }
}