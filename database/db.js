const mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host     : process.env.DB_HOST || "127.0.0.1",
    user     : process.env.DB_USER || "root",
    password : process.env.DB_PASS || "",
    database : process.env.DB_DATABASE || "sw",
    port:   process.env.DB_PORT || "3306"
});

connection.connect((error) => {
    if (error) {
        console.error('El error de conexión es: ' + error);
        return;
    }
    console.log('¡Conectado a la Base de Datos!');
});

module.exports = connection;
