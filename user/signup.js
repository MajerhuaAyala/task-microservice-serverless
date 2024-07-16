const {sendResponse, validateInput} = require("../functions")
const {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand
} = require("@aws-sdk/client-cognito-identity-provider");
const cognitoClient = new CognitoIdentityProviderClient({})

module.exports.handler = async (event) => {
  try {
    const body = event.body
    const isValid = validateInput(body)
    if (!isValid) {
      return sendResponse(400, {message: "Invalid input"})
    }

    const {email, password} = JSON.parse(body)

    const {user_pool_id} = process.env

    const params = {
      UserPoolId: user_pool_id,
      Username: email,
      UserAttributes: [
        {
          Name: 'email',
          Value: email
        },
        {
          Name: 'email_verified',
          Value: 'true'
        }],
      MessageAction: 'SUPPRESS'
    }

    const command = new AdminCreateUserCommand(params)
    const response = await cognitoClient.send(command)

    if (response.User) {
      const paramsForSetPass = {
        Password: password,
        UserPoolId: user_pool_id,
        Username: email,
        Permanent: true
      };
      const command = new AdminSetUserPasswordCommand(paramsForSetPass)
      await cognitoClient.send(command)
    }
    return sendResponse(200, {message: 'User registration successful'})
  } catch (error) {
    const message = error.message || 'Internal server error'
    return sendResponse(500, {message})
  }
}
