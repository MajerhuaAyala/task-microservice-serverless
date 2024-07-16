const {sendResponse} = require("../functions");

module.exports.handler = async (event) => {
  const {db_username, db_password} = process.env
  console.log({db_username, db_password})
  return sendResponse(200, {message: 'Success'})
}