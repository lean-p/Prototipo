CREATE DATABASE tracking;

USE tracking;

-- Creacion de tablas

CREATE TABLE Transportista (
    idTransportista BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL COMMENT 'Nombre del Courier (ej. FedEx, DHL)',
    codigo VARCHAR(10) UNIQUE COMMENT 'Código interno o abreviatura del Courier (ej. FDX)'
);

CREATE TABLE Usuario (
    userID BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    hashPassword VARCHAR(255) NOT NULL COMMENT 'Hash seguro de la contraseña',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

CREATE TABLE Documento (
    idDocumento BIGINT PRIMARY KEY AUTO_INCREMENT,
    oficializacion DATE NOT NULL,
    despacho VARCHAR(100) NOT NULL,
    via VARCHAR(50) NOT NULL COMMENT 'Medio de transporte (Aéreo, Marítimo, etc.)',
    vendedor VARCHAR(100) COMMENT 'Nombre del vendedor/exportador',
    origen VARCHAR(100) NOT NULL COMMENT 'País/Ciudad de origen del documento',
    posicionArancelaria VARCHAR(15) COMMENT 'Código arancelario (HS Code)',
    divisa VARCHAR(3) NOT NULL COMMENT 'Código ISO de la divisa (ej. USD, EUR)',
    fobTotal DECIMAL(12, 2) NOT NULL COMMENT 'Valor Total FOB',
    costoFlete DECIMAL(12, 2) COMMENT 'Costo de Flete',
    costoSeguro DECIMAL(10, 2) COMMENT 'Costo de Seguro',
    derechoDeImportacion DECIMAL(10, 2) COMMENT 'Impuestos/Derechos de Importación',
    tasaDeEstadistica DECIMAL(8, 4) COMMENT 'Tasa o porcentaje de estadía',
    iva DECIMAL(8, 4),
    ivaAdicInscr DECIMAL(8, 4),
    impGanancias DECIMAL(8, 4),
    arancelSIM DECIMAL(8, 4),
    ingresosBrutos DECIMAL(8, 4),
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
    
    
);


CREATE TABLE Seguimiento (
    idSeguimiento BIGINT PRIMARY KEY AUTO_INCREMENT,
    userID_FK BIGINT NOT NULL COMMENT 'FK al usuario propietario del seguimiento',
    idTransportista_FK BIGINT NOT NULL COMMENT 'FK al transportista',
    idDocumento_FK BIGINT COMMENT 'FK al documento comercial asociado',
    nro_tracking VARCHAR(50) NOT NULL COMMENT 'Número de tracking principal del courier (nro_transporte)',
    descripcion VARCHAR(500) COMMENT 'Referencia interna/Descripción del cliente', -- Nuevo nombre
    estadoActual VARCHAR(100),
    ubicacionActual VARCHAR(100),
    fechaInicio DATETIME NOT NULL COMMENT 'Fecha y hora de inicio del seguimiento (despacho/pickup)',
    notificacionInactividadEnviada BOOLEAN,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,

    FOREIGN KEY (userID_FK) REFERENCES Usuario(userID),
    FOREIGN KEY (idTransportista_FK) REFERENCES Transportista(idTransportista),
    FOREIGN KEY (idDocumento_FK) REFERENCES Documento(idDocumento),

    UNIQUE KEY uk_tracking_transportista (nro_tracking, idTransportista_FK)
);


CREATE TABLE Evento (
    idEvento BIGINT PRIMARY KEY AUTO_INCREMENT,
    idSeguimiento_FK BIGINT NOT NULL COMMENT 'FK al seguimiento al que pertenece el evento',
    fechaHora DATETIME NOT NULL COMMENT 'Fecha y hora del escaneo del evento',
    codigoPais VARCHAR(3) COMMENT 'País donde ocurrió el evento',
    estado VARCHAR(50) NOT NULL COMMENT 'Código de estado original del Courier (ej. AR, IX)',
    origen VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500) COMMENT 'Descripción detallada del evento del Courier',
    ubicacion VARCHAR(255) COMMENT 'Ubicación textual si no está en Pieza',
    esFinalizado BOOLEAN,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,

    FOREIGN KEY (idSeguimiento_FK) REFERENCES Seguimiento(idSeguimiento)
);

CREATE TABLE Alerta (
    idAlerta BIGINT PRIMARY KEY AUTO_INCREMENT,
    userID_FK BIGINT NOT NULL COMMENT 'FK al usuario que creó la alerta',
    idEvento_FK BIGINT COMMENT 'FK al evento específico que disparó la alerta (opcional)',
    fecha DATETIME NOT NULL COMMENT 'Fecha/Hora de creación de la alerta',
    leido BOOLEAN,
    texto VARCHAR(255) NOT NULL COMMENT 'Condición que dispara la alerta (ej. "Estado = ADUANA")',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,

    FOREIGN KEY (userID_FK) REFERENCES Usuario(userID),
    FOREIGN KEY (idEvento_FK) REFERENCES Evento(idEvento)
);

INSERT INTO transportista (nombre, codigo) VALUES ('DHL', 'DHL');
INSERT INTO transportista (nombre, codigo) VALUES ('Fedex', 'FDXE');

