// Importa mysql2
import mysql from 'mysql2';

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',        // Cambia esto si es otro host
  user: 'lasLindas',       // Reemplaza con el usuario que te dieron
  password: 'Resentidas3', // Reemplaza con tu contraseña
  database: 'muebles'    // Reemplaza con el nombre de la base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar: ' + err.stack);
    return;
  }
  console.log('Conectado como ID ' + connection.threadId);
});

// Ejemplo de una consulta
/*connection.query('SELECT * FROM nombre_tabla', (err, results, fields) => {
  if (err) {
    console.error('Error en la consulta: ' + err.stack);
    return;
  }
  console.log('Resultados: ', results);
});
*/
// Cierra la conexión cuando termines
connection.end();
