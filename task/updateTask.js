const {sendResponse} = require("../functions");
const {executeQuery} = require("../utils/connection-db");
module.exports.handler = async (event, context, callback) => {
  const {id} = event.pathParameters
  const body = JSON.parse(event.body)
  const owner = event.requestContext.authorizer.claims.email

  let queryUpdate = `
    UPDATE tasks set 
  `
  const values = []
  const updateValues = []

  if (body.title) {
    updateValues.push(`title = ?`)
    values.push(body.title)
  }

  if (body.description) {
    updateValues.push(`description = ?`)
    values.push(body.description)
  }

  if (body.status) {
    updateValues.push(`status = ?`)
    values.push(body.status)
  }

  if (body.priority) {
    updateValues.push('priority = ?')
    values.push(body.priority)
  }

  if(updateValues.length > 0){
    queryUpdate += updateValues.join(",")
    queryUpdate += ` WHERE task_id = ?`
    values.push(Number(id))
    await executeQuery(queryUpdate, values)

    console.log(`Se tiene que enviar la notificacion: ${owner}`)
  }

  return sendResponse(200, {message: "Update successful"})
}