require('dotenv').config(); 

const { Sequelize } = require('sequelize');

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD LEÍDA:", process.env.DB_PASSWORD);

// 2. Crear la instancia de conexión de Sequelize
const sequelize = new Sequelize(
    // Parámetros leídos desde el archivo .env
    process.env.DBDW_NAME,      // Nombre de tu base de datos (DB_NAME)
    process.env.DB_USER,      // Usuario de MySQL (DB_USER)
    process.env.DB_PASSWORD,  // Contraseña de MySQL (DB_PASSWORD)
    {
        host: process.env.DB_HOST, // Host (DB_HOST) - Generalmente 'localhost'
        dialect: 'mysql',          // Indicamos que vamos a usar MySQL
        logging: false,            // Desactiva los logs SQL en la consola (opcional)
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// 3. Exportar la instancia para que otros módulos la utilicen
module.exports = sequelize;