const {sendResponse} = require("../functions");
const {executeQuery} = require("../utils/connection-db");
module.exports.handler = async (event, context, callback) => {
  const body = JSON.parse(event.body)
  const {title, description, status, priority} = body
  await executeQuery(`
  INSERT INTO tasks (title, description, status, priority)
  VALUES (?, ?, ?, ?);`, [title, description, status, priority])
  return sendResponse(200, body)
}