const { AdminInitiateAuthCommand, CognitoIdentityProviderClient } = require("@aws-sdk/client-cognito-identity-provider")
const { validateInput, sendResponse } = require("../functions")

module.exports.handler = async (event) => {
  try {
    const body = event.body
    const isValid = validateInput(body)

    if (!isValid) {
      return sendResponse(400, { message: "Invalid inpout" })
    }

    const { email, password } = JSON.parse(body)

    const { user_pool_id, client_id } = process.env

    const cognitoClient = new CognitoIdentityProviderClient({})

    const params = {
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      UserPoolId: user_pool_id,
      ClientId: client_id,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    }

    const command = new AdminInitiateAuthCommand(params)

    const response = await cognitoClient.send(command)
    return sendResponse(200, { message: 'Success', token: response.AuthenticationResult.IdToken })
  } catch (error) {
    const message = error.message || 'Internal server Error'
    console.error(error)
    return sendResponse(500, { message })
  }
}