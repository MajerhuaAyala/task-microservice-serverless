const mysql = require('mysql2/promise');

async function connectionDb() {
  const connectionConfig = {
    host: process.env.host_url,
    user: process.env.db_username,
    password: process.env.db_password,
    database: process.env.db_name
  };

  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log('Conectado a la base de datos como id', connection.threadId);

    return connection
  } catch (error) {
    console.error('Error en la conexión o consulta:', error.stack);
  }
}

module.exports = {
  connectionDb
}

