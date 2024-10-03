const mysql = require('mysql2');
const connection = mysql.create({
    host     : process.env.DB_HOST || "127.0.0.1",
    user     : process.env.DB_USER || "root",
    password : process.env.DB_PASS || "",
    database : process.env.DB_DATABASE || "sw",

});

connection.connect((error) => {
    if (error) {
        console.error('El error de conexión es: ' + error);
        return;
    }
    console.log('¡Conectado a la Base de Datos!');
});

module.exports = connection;
