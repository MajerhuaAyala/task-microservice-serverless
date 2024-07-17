const {sendResponse} = require("../functions");
const {executeQuery} = require("../utils/connection-db");
const AWSXRay = require("aws-xray-sdk-core")
const {LambdaClient, GetAccountSettingsCommand} = require("@aws-sdk/client-lambda")

const lambda = AWSXRay.captureAWSv3Client(new LambdaClient())

module.exports.handler = async (event, context, callback) => {
  const body = JSON.parse(event.body)
  const owner = event.requestContext.authorizer.claims.email
  const {title, description, status, priority} = body
  await executeQuery(`
  INSERT INTO tasks (title, description, status, priority, owner)
  VALUES (?, ?, ?, ?, ?);`, [title, description, status, priority, owner])
  await getAccountSettings()
  return sendResponse(200, body)
}

const getAccountSettings = function () {
  return lambda.send(new GetAccountSettingsCommand());
};
