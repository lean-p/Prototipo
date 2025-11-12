const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

// Importar la instancia de conexión
const sequelize = require('../config/db.config'); 
const basename = path.basename(__filename);
const db = {};

// 1. Cargar todos los archivos de modelos
// Lee todos los archivos .js en esta carpeta (models) excepto este
fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        // Carga el modelo usando el formato de función que definimos (ej: require('./Usuario')(sequelize))
        const model = require(path.join(__dirname, file))(sequelize);
        db[model.name] = model;
    });

// 2. Inicializar las Asociaciones (El Paso Crítico)
// Itera sobre todos los modelos cargados y llama a la función 'associate', pasándoles el objeto 'db'
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        // Llama a .associate(models)
        db[modelName].associate(db); 
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
