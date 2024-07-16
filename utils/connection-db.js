const mysql = require('mysql2/promise');

const { RDSDataClient, ExecuteStatementCommand } = require('@aws-sdk/client-rds-data');

const rdsDataClient = new RDSDataClient({
  region: 'us-west-2',
});

async function executeQuery(query) {

  const params = {
    resourceArn: 'arn:aws:rds:us-east-2:905418036958:db:test',  // ARN del clúster de RDS
    secretArn: 'arn:aws:secretsmanager:us-east-2:905418036958:secret:dev/mysql-Eh6FoK',  // ARN del secreto en Secrets Manager
    database: 'mydatabase',  // Nombre de la base de datos
    sql: query,  // Consulta SQL con parámetros
    includeResultMetadata: true,  // Incluir metadatos en los resultados
  };

  try {
    const command = new ExecuteStatementCommand(params)
    const data = await rdsDataClient.send(command)

    if (data.records) {
      data.records.forEach(record => {
        console.log(record.map(field => field.stringValue).join(', '));
      });
    } else {
      console.log('No se encontraron resultados.');
    }
  } catch (error) {
    console.error('Error en la conexión o consulta:', error.stack);
  }
}

module.exports = {
  executeQuery
}

