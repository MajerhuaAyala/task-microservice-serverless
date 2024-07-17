const mysql = require('mysql2/promise');

async function executeQuery(query, values = []) {
  const {host_url, db_username, db_password, db_name} = process.env

  const connectionConfig = {
    host: host_url,
    user: db_username,
    password: db_password,
    database: db_name
  };

  try {
    const connection = await mysql.createConnection(connectionConfig);
    const [rows, fields] = await connection.execute(query, values);
    await connection.end();
    return rows
  } catch (error) {
    console.error('Error en la conexión o consulta:', error.stack);
  }
}

module.exports = {
  executeQuery
};
