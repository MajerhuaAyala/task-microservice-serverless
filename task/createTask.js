const {sendResponse} = require("../functions");
module.exports.handler = async (event, context, callback) => {
  console.log(JSON.stringify(event.body))
  return sendResponse(200, {message: "Hola mundo desde createTask"})
}