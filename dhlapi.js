async function getShipmentDetails(shipmentId) {
  // Generar el string Basic Auth en base64
 

  const response = await fetch(`https://api-eu.dhl.com/track/shipments?trackingNumber=${shipmentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "DHL-API-Key": "g2wbGku5ZnswWMJ0S36QAJPtK7uL9Igs"
    }
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Shipment:", data);
  return data;
}

// 🔹 Ejemplo de uso:
getShipmentDetails('3086567422');