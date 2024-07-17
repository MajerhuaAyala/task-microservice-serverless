const {sendResponse} = require("../functions");
const {executeQuery} = require("../utils/connection-db");
const {PublishCommand, SNSClient} = require("@aws-sdk/client-sns")
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

  if (updateValues.length > 0) {
    queryUpdate += updateValues.join(",")
    queryUpdate += ` WHERE task_id = ?`
    values.push(Number(id))
    await executeQuery(queryUpdate, values)

    const clientSns = new SNSClient({})
    try {
      await clientSns.send(new PublishCommand({
        Message: JSON.stringify({owner, message: `Se ha actualizado tu tarea con el id: ${id}`}),
        TopicArn: "arn:aws:sns:us-east-2:905418036958:updateTask"
      }))
    } catch (e) {
      console.error(`Error en enviar sns: ${e}`)
    }
  }

  return sendResponse(200, {message: "Update successful"})
}