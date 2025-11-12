const { DimFecha, DimUbicacion } = require('../model/dwmodel/index'); // O tu ruta

exports.obtenerOCrearDimFecha = async (fechaInput) => {
    // 1. Validar la entrada
    if (!fechaInput) {
        return null; // Si la fecha es null o undefined, devolvemos null
    }

    try {
        const fechaObjeto = new Date(fechaInput);

        // Verifica si la fecha creada es válida
        if (isNaN(fechaObjeto.getTime())) {
            console.warn(`Fecha inválida recibida: ${fechaInput}`);
            return null; // Devuelve null si la fecha no es válida
        }

        // 2. Formatear y extraer atributos (igual que antes)
        const fechaCompleta = fechaObjeto.toISOString().split('T')[0]; // YYYY-MM-DD
        const anio = fechaObjeto.getFullYear();
        const mes = fechaObjeto.getMonth() + 1;
        const dia = fechaObjeto.getDate();
        // Puedes calcular más atributos aquí (nombreMes, diaSemana, etc.) si los necesitas en defaults

        // 3. Usar findOrCreate
        const [dimFecha, fueCreadaFecha] = await DimFecha.findOrCreate({
            where: {
                fecha: fechaCompleta // Busca por la columna 'fecha' (DATEONLY)
            },
            defaults: {
                fecha: fechaCompleta,
                anio: anio,
                mes: mes,
                dia: dia
                // ...otros atributos...
            }
        });

        if (fueCreadaFecha) {
            console.log(`Nueva fecha creada en DimFecha: ${fechaCompleta}`);
        }

        // 4. Devolver el ID (PK de DimFecha)
        return dimFecha.idFecha; // O como se llame tu PK

    } catch (error) {
        console.error(`Error procesando fecha ${fechaInput} para DimFecha:`, error);
        return null; // Devuelve null en caso de error
    }
}

function determinarRegion(nombre) {

        const nombreLower = nombre.toLowerCase();
        if (nombreLower.includes('usa') || nombreLower.includes('argentina') || nombreLower.includes('panama')) {
            return 'America';
        } else if (nombreLower.includes('vietnam') || nombreLower.includes('china') || nombreLower.includes('korea')) {
            return 'Asia';
        } else if (nombreLower.includes('españa') || nombreLower.includes('germany')) { // Alemania
            return 'Europa';
        } else if (nombreLower.includes('australia') || nombreLower.includes('new zealand')) {
            return 'Oceania'; // O null, o un valor por defecto
        } else {
            return 'Africa';
        }
}

exports.obtenerOCrearDimUbicacion = async (ubicacion) =>{

    if (!ubicacion) {
        return null; // Si la fecha es null o undefined, devolvemos null
    }
    try{    

        const regionDeterminada = determinarRegion(ubicacion); // -> 'América'
        
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
        return null; // Devuelve null en caso de error

    }
}