const {sendResponse} = require("../functions");
const {executeQuery} = require("../utils/connection-db");
module.exports.handler = async (event, context, callback) => {
  const body = JSON.parse(event.body)
  const owner = event.requestContext.authorizer.claims.email
  const {title, description, status, priority} = body
  await executeQuery(`
  INSERT INTO tasks (title, description, status, priority, owner)
  VALUES (?, ?, ?, ?, ?);`, [title, description, status, priority, owner])
  return sendResponse(200, body)
}