CREATE DATABASE dwtracking;

USE dwtracking;

-- ===================================================================
-- DATABASE DDL SCRIPT (MySQL) - Versión Final con Nombres Específicos
-- ===================================================================

CREATE TABLE dimTransportista (
    idTransportista BIGINT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL COMMENT 'Nombre del Courier (ej. FedEx, DHL)'
);

CREATE TABLE dimUsuario (
    userID BIGINT PRIMARY KEY,
    email VARCHAR(100),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100)
);

CREATE TABLE dimFecha (
    idFecha BIGINT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE,
    dia INT,
    mes INT,
    anio INT
);

CREATE TABLE dimUbicacion (
    idUbicacion BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    region VARCHAR(100)
);

CREATE TABLE dimPosicionArancelaria (
    idPosicionArancelaria BIGINT PRIMARY KEY AUTO_INCREMENT,
    posicionArancelaria VARCHAR(100)
);

CREATE TABLE dimDivisa (
    idDivisa BIGINT PRIMARY KEY AUTO_INCREMENT,
    divisa VARCHAR(100)
);

CREATE TABLE dimVia(
    idVia BIGINT PRIMARY KEY AUTO_INCREMENT,
    via VARCHAR(100)
);

CREATE TABLE dimEstado(
    idEstado BIGINT PRIMARY KEY AUTO_INCREMENT,
    estado VARCHAR(100)
);

CREATE TABLE dimVendedor(
    idVendedor BIGINT PRIMARY KEY AUTO_INCREMENT,
    vendedor VARCHAR(100)
);

CREATE TABLE dimDespacho(
    idDespacho BIGINT PRIMARY KEY AUTO_INCREMENT,
    despacho VARCHAR(100)
);


CREATE TABLE dimDetalle (
    idDetalle BIGINT PRIMARY KEY,
    idVendedor BIGINT NOT NULL COMMENT 'Nombre del vendedor/exportador',
    idDespacho BIGINT NOT NULL,
    idUbicacion BIGINT NOT NULL COMMENT 'País/Ciudad de origen del documento',
    idOficializacion BIGINT NOT NULL COMMENT 'Fecha de emisión del documento',
    fobTotal DECIMAL(12, 2) NOT NULL COMMENT 'Valor Total FOB',
    costoFlete DECIMAL(12, 2) COMMENT 'Costo de Flete',
    costoSeguro DECIMAL(10, 2) COMMENT 'Costo de Seguro',
    idPosicionArancelaria BIGINT NOT NULL COMMENT 'Código arancelario (HS Code)',
    derechoDeImportacion DECIMAL(10, 2) COMMENT 'Impuestos/Derechos de Importación',
    tasaDeEstadistica DECIMAL(8, 4) COMMENT 'Tasa o porcentaje de estadía',
    iva DECIMAL(8, 4),
    ivaAdicInscr DECIMAL(8, 4),
    impGanancias DECIMAL(8, 4),
    arancelSIM DECIMAL(8, 4),
    ingresosBrutos DECIMAL(8, 4),
    idDivisa BIGINT NOT NULL COMMENT 'Código ISO de la divisa (ej. USD, EUR)',
    idVia BIGINT NOT NULL COMMENT 'Medio de transporte (Aéreo, Marítimo, etc.)',

    FOREIGN KEY (idUbicacion) REFERENCES dimUbicacion(idUbicacion),
    FOREIGN KEY (idVendedor) REFERENCES dimVendedor(idVendedor),
    FOREIGN KEY (idOficializacion) REFERENCES dimFecha(idFecha),
    FOREIGN KEY (idPosicionArancelaria) REFERENCES dimPosicionArancelaria(idPosicionArancelaria),
    FOREIGN KEY (idDivisa) REFERENCES dimDivisa(idDivisa),
    FOREIGN KEY (idVia) REFERENCES dimVia(idVia),
    FOREIGN KEY (idDespacho) REFERENCES dimDespacho(idDespacho)
);


CREATE TABLE fact_Seguimiento (
    idSeguimiento BIGINT PRIMARY KEY,
    userID BIGINT NOT NULL COMMENT 'FK al usuario propietario del seguimiento',
    idTransportista BIGINT NOT NULL COMMENT 'FK al transportista',
    idDetalle BIGINT COMMENT 'FK al documento comercial asociado',
    nro_tracking VARCHAR(50) NOT NULL COMMENT 'Número de tracking principal del courier (nro_transporte)',
    descripcion VARCHAR(500) COMMENT 'Referencia interna/Descripción del cliente', -- Nuevo nombre
    idEstado BIGINT NOT NULL,
    idUbicacion BIGINT NOT NULL,
    idOrigen BIGINT NOT NULL,
    idFecha BIGINT NOT NULL COMMENT 'Fecha y hora de inicio del seguimiento (despacho/pickup)',
    idFechaInicial BIGINT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,

    -- Definición de Claves Foráneas
    FOREIGN KEY (userID) REFERENCES dimUsuario(userID),
    FOREIGN KEY (idTransportista) REFERENCES dimTransportista(idTransportista),
    FOREIGN KEY (idDetalle) REFERENCES dimDetalle(idDetalle),
    FOREIGN KEY (idEstado) REFERENCES dimEstado(idEstado),
    FOREIGN KEY (idUbicacion) REFERENCES dimUbicacion(idUbicacion),
    FOREIGN KEY (idOrigen) REFERENCES dimUbicacion(idUbicacion),
    FOREIGN KEY (idFecha) REFERENCES dimFecha(idFecha),
    FOREIGN KEY (idFechaInicial) REFERENCES dimFecha(idFecha)
);

CREATE TABLE EtlMetadata (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombreProceso VARCHAR(50) UNIQUE,
    ultimaEjecucionExitosa DATETIME
);

INSERT INTO EtlMetadata (nombreProceso, ultimaEjecucionExitosa) VALUES ('ETL_Seguimientos', '1970-01-01 00:00:00'); -- Una fecha muy antigua para la primera vez

