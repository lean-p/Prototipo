// src/services/servicioOcr.js

const { createWorker } = require('tesseract.js');
const { createCanvas, Image } = require('canvas');
const pdfjsLib = require('pdfjs-dist/build/pdf.js');
const path = require('path');

/**
 * -----------------------------------------------------------------
 * HELPER 1: Conversor de PDF a PNG
 * (scale: 2.0 y Page 1)
 * -----------------------------------------------------------------
 */
async function convertPdfToPngBuffer(pdfBuffer) {
    console.log('[PDF-Converter] Iniciando conversión (Pág 1 @ 200%)...');

    // Arreglo de la ruta de fuentes: Sube 2 niveles (src/services -> raíz)
    const pdfjsDistDir = path.resolve(__dirname, '../../node_modules/pdfjs-dist');
    const standardFontDataUrl = path.join(pdfjsDistDir, 'standard_fonts/');

    const data = new Uint8Array(pdfBuffer);
    const pdfDoc = await pdfjsLib.getDocument({
        data: data,
        standardFontDataUrl: standardFontDataUrl 
    }).promise;

    console.log(`[PDF-Converter] Documento cargado. ${pdfDoc.numPages} páginas. PROCESANDO SÓLO PÁGINA 1.`);
    
    const page = await pdfDoc.getPage(1); 
    const scale = 2.0; // Mantenemos 2.0 (bueno para números)
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    
    console.log('[PDF-Converter] PDF renderizado a canvas.');
    return canvas.toBuffer('image/png'); 
}


/**
 * -----------------------------------------------------------------
 * HELPER 2: El "Traductor" v15 (El que funcionaba)
 * (Mapeado a tu Modelo SQL + Arreglo Despacho + Impuesto 011)
 * -----------------------------------------------------------------
 */
function parsearSim_v15_DHL(textoCompleto) {
    const lineas = textoCompleto.split('\n');
    
    // Nombres de campos de tu modelo 'Documento.js'
    const datos = {
        oficializacion: null, despacho: null, via: null, vendedor: null,
        origen: null, posicionArancelaria: null, divisa: 'DOL',
        fobTotal: 0, costoFlete: 0, costoSeguro: 0, 
        derechoDeImportacion: 0, tasaDeEstadia: 0, iva: 0, 
        impuestosInternos: 0, ivaAdicInscr: 0, impGanancias: 0, 
        arancelSIM: 0, ingresosBrutos: 0
    };

    // --- Helper para limpiar los números (v21 - el que no multiplica) ---
    function limpiarNumero(stringNumero) {
        if (!stringNumero) return 0;
        const limpio = stringNumero.replace('P', '').replace(/\s/g, '').replace(/[\.,](?=\d{3})/g, '');
        const final = limpio.replace(',', '.');
        const numero = parseFloat(final);
        return isNaN(numero) ? 0 : numero;
    }

    // --- Helper: Extraer Impuesto (Flexible) ---
    function extraerImpuesto(codigo, nombreCampo) {
        const regexImpuesto = new RegExp(`\\(\\s*${codigo}\\s*\\)`);
        const lineaImpuesto = lineas.find(l => regexImpuesto.test(l));
        
        if (lineaImpuesto) {
            const numerosEnLinea = lineaImpuesto.match(/([\d\.,]+)/g);
            if (numerosEnLinea && numerosEnLinea.length > 0) {
                const valor = numerosEnLinea[numerosEnLinea.length - 1];
                let numeroLimpio = limpiarNumero(valor);
                
                // El parche para "100" (que Tesseract lee mal con scale 2.0)
                if (codigo === '500' && (numeroLimpio === 100 || numeroLimpio === 1000)) {
                    console.warn(`[ParsearSIM-v15] ADVERTENCIA: Tesseract leyó mal el Arancel SIM (500). Corrigiendo a '10'.`);
                    numeroLimpio = 10;
                }
                
                datos[nombreCampo] += numeroLimpio; 
            }
        }
    }

    console.log(`[ParsearSIM-v15-DHL] Analizando ${lineas.length} líneas de la Página 1...`);

    try {
        let match;

        // --- 1. Oficialización (Formato YYYY-MM-DD) ---
        match = textoCompleto.match(/(\d{2})\/(\d{2})\/(\d{4})/); 
        if (match) {
             let anio = match[3];
             if (anio === "2005") anio = "2025"; // Parche 2005/2025
            datos.oficializacion = `${anio}-${match[2]}-${match[1]}`; 
        }

        // --- 2. Despacho (con arreglo S/$) ---
        match = textoCompleto.match(/(\d{2} \d{3} IC04 \d{6} \S)/);
        if (match) {
            let despacho = match[1];
            if (despacho.endsWith('$')) {
                despacho = despacho.slice(0, -1) + 'S';
            }
            datos.despacho = despacho; 
        }

        // --- 3. Vía ---
        const lineaVia = lineas.find(l => l.startsWith('AVION'));
        if (lineaVia) datos.via = 'AVION';

        // --- 4. Vendedor (Lógica DHL v12 - La que SÍ funciona) ---
        // Esta lógica SÍ funciona con scale 2.0 porque busca el CUIT
        const lineaAgente = lineas.find(l => l.includes('30-58011131-5')); // CUIT de DHL
        if (lineaAgente) {
            const match = lineaAgente.match(/30-58011131-5\s+(.+)/);
            if (match && match[1]) {
                datos.vendedor = match[1].trim();
            }
        }

        // --- 5. Origen (Lógica DHL v12 - La que SÍ funciona) ---
        const indiceLineaOrigen = lineas.findIndex(l => l.includes('Origen Pais') && l.includes('Provincia')); 
        if (indiceLineaOrigen > -1 && lineas[indiceLineaOrigen + 1]) {
            const valueRow = lineas[indiceLineaOrigen + 1].trim();
            const partes = valueRow.split(' '); 
            if (partes.length > 1) datos.origen = partes[1].trim(); 
        }

        // --- 6. FOB Total y Flete Total (Lógica DHL v12) ---
        const headerIndex = lineas.findIndex(l => l.includes('FOB Total') && l.includes('Flete Total')); 
        if (headerIndex > -1 && lineas[headerIndex + 1]) {
            const valueRow = lineas[headerIndex + 1];
            const numeros = valueRow.match(/([\d\.,]+)/g); 
            if (numeros && numeros.length > 0) datos.fobTotal = limpiarNumero(numeros[0]); 
            if (numeros && numeros.length > 1) datos.costoFlete = limpiarNumero(numeros[1]); 
        }
        
        // --- 7. Seguro Total (Lógica DHL v12) ---
        const seguroHeaderIndex = lineas.findIndex(l => l.trim().startsWith('Seguro Total')); 
        if (seguroHeaderIndex > -1 && lineas[seguroHeaderIndex + 1]) {
            const lineaSiguiente = lineas[seguroHeaderIndex + 1];
            const match = lineaSiguiente.trim().match(/([\d\.,]+)/); 
            if (match) datos.costoSeguro = limpiarNumero(match[1]); 
        }

        // --- 8. Posición SIM (Lógica DHL v12) ---
        match = textoCompleto.match(/(\d{4}\.\d{2}\.\d{2}\.\d{3}\w)/);
        if (match) {
             let sim = match[0];
             if (sim.endsWith('7')) sim = sim.slice(0, -1) + 'Z';
             datos.posicionArancelaria = sim; 
        }
        
        // --- 9. Impuestos (Mapeados a tu modelo) ---
        extraerImpuesto('010', 'derechoDeImportacion');
        extraerImpuesto('011', 'tasaDeEstadia');
        extraerImpuesto('415', 'iva');
        extraerImpuesto('422', 'ivaAdicInscr');
        extraerImpuesto('424', 'impGanancias');
        extraerImpuesto('500', 'arancelSIM');
        extraerImpuesto('900', 'ingresosBrutos');

    } catch (error) {
        console.error('[ParsearSIM-v15-DHL] Error parseando:', error);
    }
    
    return datos;
}


/**
 * -----------------------------------------------------------------
 * ¡LA FUNCIÓN PRINCIPAL QUE EXPORTAMOS!
 * -----------------------------------------------------------------
 */
exports.analizarDocumentoDeAduana = async (pdfBuffer) => {
    let worker;
    try {
        // 1. Convertir PDF a PNG (scale 2.0 y Page 1)
        const pngBuffer = await convertPdfToPngBuffer(pdfBuffer, 1, 2.0);

        // 2. Iniciar Tesseract
        console.log('Iniciando Tesseract worker...');
        worker = await createWorker('spa');
        
        // 3. Reconocer el PNG
        console.log('Tesseract reconociendo PNG...');
        const { data: { text } } = await worker.recognize(pngBuffer);
        
        // 4. Parsear el texto
        console.log('Tesseract terminó. Parseando resultados...');
        const datosExtraidos = parsearSim_v15_DHL(text);
        
        return datosExtraidos; // Devuelve el JSON limpio

    } catch (error) {
        console.error('Error en el servicio OCR:', error);
        throw new Error('Falló el procesamiento del documento.');
    } finally {
        // 5. Asegurarse de cerrar el worker
        if (worker) {
            await worker.terminate();
            console.log('Tesseract worker terminado.');
        }
    }
};