const {sendResponse} = require("../functions");
const {executeQuery} = require("../utils/connection-db");

module.exports.handler = async (event) => {
  //const {id} = event.queryStringParameters
  const {id} = event.pathParameters
  const response = await executeQuery('SELECT * FROM tasks WHERE task_id = ?;', [Number(id)])
  return sendResponse(200, response)
}