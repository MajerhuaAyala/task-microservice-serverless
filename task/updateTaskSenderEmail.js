const {SESClient, SendEmailCommand} = require("@aws-sdk/client-ses")

const sesClient = new SESClient({})

module.exports.handler = async (event, context, callback) => {

  for (const record of event.Records) {

    const body = JSON.parse(record.Sns.Message)

    console.log({body})

    const params = {
      Destination: {
        ToAddresses: ["marcelino.majerhua.dev@gmail.com"]
      },
      Message: {
        Body: {
          Text: {
            Charset: "UTF-8",
            Data: body.message
          }
        },
        Subject: {
          Charset: "UTF-8",
          Data: "EMAIL_SUBJECT_TEST",
        }
      },
      Source: body.owner
    }

    console.log(JSON.stringify(params))

    try {
      await sesClient.send(new SendEmailCommand(params))
    } catch (e) {
      console.error(`updateTaskSenderEmail: `, e)
    }
  }
}